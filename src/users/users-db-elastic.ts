import { Client, ClientOptions, errors } from "@elastic/elasticsearch";
import { IUserDB, User, UserBasic, } from "./types";

class UniqueEmailViolationError extends Error {
    constructor(m?: string) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, UniqueEmailViolationError.prototype);
    }
}

export class UserDbElastic implements IUserDB {
  private client: Client

  constructor(options: ClientOptions) {
    this.client = new Client(options)
  }


  setupIndexes = async (): Promise<void> => {
    try {
      const result = await this.client.indices.create({
        "index": "users",
        "mappings": {
          "properties": {
            "email": {
              "type": "text"
            }
          }
        }
      });
      if (!result.acknowledged) {
        throw new Error("Failed to acknowledge places index creation");
      }
    } catch (err) {

      if (err instanceof errors.ResponseError && err.body.error.type === "resource_already_exists_exception") {
        console.info(`Index ${err.body.error.index} already setup ✅`);
        return;
      } else if (err instanceof errors.ResponseError) {
        console.error(err.body);
      }
      throw err;
    }
  };


  getByEmail: IUserDB['getByEmail'] = async (email) => {
    const searchResult = await this.client.search<User>({
      index: 'users',
      body: {
        query: {
          match : {
            email
          }
        }
      },
    })
    if (!searchResult.hits.hits.length) return undefined
    const hit = searchResult.hits.hits[0]
    return hit._source ? { ...hit._source, _id: searchResult.hits.hits[0]._id } : undefined
  }

  update: IUserDB['update'] = async (user) => {
    if (!user._id) {
      throw 'invalid-update-payload'
    }
    const { _id, ...updateUserFields } = user
    const updateResult = await this.client.update<User,Partial<User>>({
      index: 'users',
      id: _id,
      body: {
        doc: updateUserFields
      }
    })
    if (updateResult.result === 'updated') return user
    throw new Error('not updated')
  }

  create: IUserDB['create'] = async (user) => {
    // Check if there is already a registry in db with that email
    const searchResult = await this.client.search({
      index: 'users',
      body: {
        query: {
          term: {
            email: user.email
          }
        }
      }
    })
    if (searchResult.hits.hits.length > 0) {
      throw new UniqueEmailViolationError()
    }
    const indexResult = await this.client.index<Omit<UserBasic, '_id'>>({
      index: 'users',
      body: user,
      refresh: 'wait_for',
    })
    if (indexResult.result !== 'created') {
      throw new Error('user was not created!!!')
    }
    return {
      ...user,
      _id: indexResult._id
    }
  }
}
