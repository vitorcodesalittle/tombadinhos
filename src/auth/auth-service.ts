import { Client, ClientOptions, errors } from "@elastic/elasticsearch";
import { CodeVerifyResult, IAuthService, VerificationCode } from "./types";
import { randomInt } from 'node:crypto'

const CODE_LENGTH = 6

export class AuthService implements IAuthService {
  private client: Client
  constructor(options: ClientOptions) {
    this.client = new Client(options)
  }
  createVerificationCode: (email: string) => Promise<string> = async (email) => {
    // Generate code
    const code = new Array(CODE_LENGTH).fill(9).map(() => randomInt(0, 10)).map(n => n.toString()).join('')
    // Store code in db
    // creates a utc date in 2 hours from now
    const date = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()

    await this.client.index({
      index: 'auth',
      body: {
        email,
        code,
        validUntil: date,
        used: false
      },
      refresh: true,
    })
    // Return code
    return code
  }
  verifyCode: (email: string, code: string) => Promise<CodeVerifyResult> = async (email, code) => {
    // Searchs the auth index for exatc match of fields email, code and used = false
    const result = await this.client.search<VerificationCode>({
      index: 'auth',
      body: {
        query: {
          bool: {
            must: [
              { match: { email } },
              { match: { code } },
              { term: { used: false } },
            ]
          }
        }
      }
    })


    if (result.hits.hits.length < 1)
      return {
        error: 'code not found'
      }
    if (!result.hits.hits[0]._source) {
      throw new Error('document is missing. Document:\n' + JSON.stringify(result.hits.hits[0], null, 1))
    }

    // update token with used flag
    await this.client.update({
      index: 'auth',
      id: result.hits.hits[0]._id,
      body: {
        doc: {
          used: true
        },
      },
      refresh: true
    })

    return {
      code,
      email,
      validUntil: new Date(result.hits.hits[0]._source.validUntil),
      used: true,
    }
  }

  setupIndexes = async () => {
    try {
      const result = await this.client.indices.create({
        index: 'auth',
        body: {
          mappings: {
            properties: {
              email: {
                type: 'keyword'
              },
              code: {
                type: 'keyword'
              },
              validUntil: {
                type: 'date'
              },
              used: {
                type: 'boolean'
              }
            }
          }
        }
      })
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
  }
}
