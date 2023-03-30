import { ApiConfig } from "@/config";
import { validateToken } from "./jwt";
import { IUserService, IUserDB, User, UserBasic } from "./types";
import { UserServiceError } from "./errors";
import { ApiError } from '@/apiError'

export class UserService implements IUserService {

  private userDb: IUserDB
  private config: ApiConfig
  constructor(userDb: IUserDB, config: ApiConfig) {
    this.userDb = userDb
    this.config = config;
  }

  async create(user: UserBasic): Promise<UserBasic> {
    if (this.config.allowedEmails.includes(user.email))
      return this.userDb.create(user)
    else {
      throw new ApiError('Email is not listed', UserServiceError.EmailNotListed)
    }
  }

  async get(token: string): Promise<User> {
    const result = await validateToken(token, this.config.secret)
    if (result?.error === 'invalid-token') {
      throw new ApiError('JWT token is not valid', UserServiceError.InvalidJWT)
    } else if (result?.error && ['token-expired', 'unknown-error'].includes(result?.error)) {
      throw new ApiError('JWT token is expired', UserServiceError.ExpiredJWT)
    } else if (result.data) {
      return result.data
    } else {
      throw new ApiError('Internal Error: ' + result.error)
    }
  }
}
