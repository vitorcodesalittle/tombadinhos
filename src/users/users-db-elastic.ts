import { Client, ClientOptions } from "@elastic/elasticsearch";
import { IUserDB, UserBasic, UserRegistered } from "./types";

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

  update: IUserDB['update'] = async (user) => {
    if (!user._id) {
      throw 'invalid-update-payload'
    }
    const { _id, ...updateUserFields } = user
    const updateResult = await this.client.update({
      index: 'users',
      id: _id,
      body: {
        doc: updateUserFields
      }
    })
    if (updateResult.result === 'updated') return user
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
      refresh: true,
    })
    return {
      ...user,
      _id: indexResult._id
    }

  }
}
