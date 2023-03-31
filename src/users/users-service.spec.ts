import { getEsConfig } from "@/places/places-db-elastic"
import { UserDbElastic } from "./users-db-elastic"
import { UserService } from "./users-service"
import { config } from "@/config"
import { createToken } from "./jwt"
import { UserServiceError } from "./errors"
import { ApiError } from "@/apiError"
import { IAuthService } from "@/auth/types"
import { IEmailService } from "@/email/types"
import { deleteAll } from "test/utils"
import {expect} from '@jest/globals'

describe('UserService', () => {
  let userDb: UserDbElastic
  let userService: UserService
  let authService: IAuthService
  let emailService: IEmailService
  beforeAll(async () => {
    const esConfig = getEsConfig(config)
    userDb = new UserDbElastic(esConfig)
    await userDb.setupIndexes()
    await deleteAll('users', esConfig)
    authService = {
      verifyCode: jest.fn(),
      createVerificationCode: jest.fn()
    }
    emailService = {
      sendEmail: jest.fn()
    }
    userService = new UserService(userDb, authService, config, emailService)
  })

  describe('get(token)', () => {
    it('returns user encoded by JWT token', async () => {
      // Creates mock user in usersDb
      const testEmail = 'user@domainmmmm.com'
      const user = await userDb.create({
        email: testEmail,
      })
      expect(user.email).toBe(testEmail)
      // Creates mock token with user
      const token = await createToken(user, config.secret);
      // Gets user from token
      const userFromToken = await userService.get(token)
      expect(userFromToken.email).toBe(user.email)
    })
    it('throws Error with "invalid-jwt" code when jwt signature doesnt match', async () => {
      // Creates mock user in usersDb
      const testEmail = 'user@domain.com'
      const user = await userDb.create({
        email: testEmail,
      })
      // Creates mock token with invalid signature
      const token = await createToken(user, config.secret);
      try {
        await userService.get(token)
      } catch (err) {
        expect(err).toBeInstanceOf(Error)
        expect(err?.message).toBe('invalid-jwt')
      }
    })
    it('throws ExpiredJWTError when jwt is expired', async () => {
      // Creates mock user in usersDb
      const testEmail = 'user@domain.com'
      const user = await userDb.create({
        email: testEmail,
      })
      // Creates mock token with expired jwt
      const token = await createToken(user, config.secret, { expiresIn: '1ms' });
      try {
        await userService.get(token)
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError)
        expect(err?.code).toBe(UserServiceError.ExpiredJWT)
      }
    })
  })

  describe('createUser(userCreationPayload)', () => {
    it('returns created user with _id attribute a non-zero length string', async () => {
      // Creates mock user in usersDb
      const testEmail = 'user@domain.com'
      const user = await userDb.create({
        email: testEmail,
      })
      expect(user._id).toBeTruthy()
    })
  })

  describe('verifyEmail(email) ', () => {
    it('creates verification code with authService', async () => {
      const testEmail = 'userijdaisjdiasdiajsidjauwequ@domain.com'
      const testUser = await userDb.create({
        email: testEmail,
      })
      expect(testUser).toHaveProperty('_id')
      const baseUrl = ''
      const code = '213', linkRegex = new RegExp(`^http:\/\/localhost:8080\/verify\\?tk=.+$`)
      const createVerificationCodeMock = jest.fn(async () => code)
      authService.createVerificationCode =  createVerificationCodeMock
      const sendEmailMock = jest.fn(async () => ({ confirmed: true }))
      emailService.sendEmail =  sendEmailMock
      await userService.verifyEmail(testEmail)
      expect(authService.createVerificationCode).toBeCalledWith(testEmail)
      // assert email service is called with correct params
      expect(sendEmailMock.mock.lastCall).toHaveLength(1)
      const arg = sendEmailMock.mock.lastCall[0]
      expect(arg.email).toBe(testEmail)
      expect(arg.templatePath).toBe('templates/account-verify')
      expect(arg.data.link).toMatch(linkRegex)
    })
  })
})
