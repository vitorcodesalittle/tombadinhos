import { getEsConfig } from "@/places/places-db-elastic"
import { UserDbElastic } from "./users-db-elastic"
import { UserService } from "./users-service"
import { config } from "@/config"
import { createToken } from "./jwt"

describe('UserService', () => {
  let userDb: UserDbElastic
  let userService: UserService
  beforeAll(() => {
    // Setups usersService and usersDb for following tests
    userDb = new UserDbElastic(getEsConfig(config))
    userService = new UserService(userDb, config)
  })

  describe('get(token)', () => {
    it('returns user encoded by JWT token', async () => {
      // Creates mock user in usersDb
      const testEmail = 'user@domainmmmm.com'
      const user = await userDb.create({
        email: testEmail,
      })
      expect(user.email).toBe(testEmail)
      console.info('create user', user)
      // Creates mock token with user
      const token = await createToken(user, config.secret);
      console.info('created token', token)
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
        expect(err).toBeInstanceOf(Error)
        expect(err?.message).toBe('jwt expired')
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
})
