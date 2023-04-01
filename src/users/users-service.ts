import { ApiConfig, config } from "@/config";
import { createToken, validateToken } from "./jwt";
import { IUserService, IUserDB, User, UserBasic, } from "./types";
import { UserServiceError } from "./errors";
import { ApiError } from '@/apiError'
import { IEmailService } from "@/email/types";
import { IAuthService } from "@/auth/types";

export class UserService implements IUserService {

  private userDb: IUserDB
  private authCodeDb: IAuthService
  private emailService: IEmailService
  private config: ApiConfig
  constructor(userDb: IUserDB, authCodeDb: IAuthService, config: ApiConfig, emailService: IEmailService) {
    this.userDb = userDb
    this.config = config;
    this.authCodeDb = authCodeDb
    this.emailService = emailService
  }
  async update(token: string, update: Partial<User>): Promise<Partial<User>> {
    // gets user from token
    const user = await this.get(token)
    // updates user
    const updatedUser = await this.userDb.update({
      ...user,
      ...update
    })
    if (!updatedUser) throw new ApiError(UserServiceError.UserNotFound)
    return updatedUser
  }

  async verifyEmail(email: string): Promise<boolean> {
    let user = await this.userDb.getByEmail(email)
    if (!this.config.allowedEmails.includes(email)) throw new ApiError('Email is not listed', UserServiceError.EmailNotListed)
    if (!user)  {
      user = await this.create({email})
    }
    const code: string = await this.authCodeDb.createVerificationCode(email)
    const token: string = await createToken(user, config.secret)
    const baseUrl = "http://localhost:8080"
    const link: string = `${baseUrl}/verify?tk=${token}`
    const emailresult = await this.emailService.sendEmail({
      templatePath: 'templates/account-verify',
      email,
      data: {
        code, link
      }
    })
    return emailresult.confirmed
  }

  async create(user: UserBasic): Promise<User> {
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
      throw new ApiError('JWT token expired', UserServiceError.ExpiredJWT)
    } else if (result.data) {
      return result.data
    } else {
      throw new ApiError('Internal Error: ' + result.error)
    }
  }
}
