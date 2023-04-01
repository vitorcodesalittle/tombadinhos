import { beforeAll } from "@jest/globals"
import { AuthService } from "./auth-service"
import { getEsConfig } from "@/places/places-db-elastic"
import { config } from "@/config"
import { VerificationCode } from "./types"

describe('AuthService', () => {
  let authService: AuthService

  beforeAll(async () => {
    authService = new AuthService(getEsConfig(config))
    await authService.setupIndexes()
  })
  describe('createVerificationCode', () => {
    it('creates a verification code and returns it', async () => {
      const code = await authService.createVerificationCode('user@domain.com')
      expect(code).toHaveLength(6)
      expect(code).toMatch(/^[0-9]+$/)
    })
  })


  describe('verifyCode', () => {
    it('returns the verification code object with correct properties', async () => {
      const email = 'user2@domain.com'
      const code = await authService.createVerificationCode(email)
      const result = await authService.verifyCode(email, code)
      expect(result).toHaveProperty('email', email)
      expect(result).toHaveProperty('code', code)
      expect(result).toHaveProperty('validUntil')
      expect(result).toHaveProperty('used', true)
      expect((result as VerificationCode).validUntil.valueOf()).toBeGreaterThan(new Date().valueOf())
    })
    it('returns error when verifying the same code twice', async () => {
      const email = 'user3@domain.com'
      const code = await authService.createVerificationCode(email)
      await authService.verifyCode(email, code)
      const result = await authService.verifyCode(email, code)
      expect(result).toHaveProperty('error', 'code not found')
    })
    it('verifies the user for a second time', async () => {
      const email = 'user4@domain.com'
      const code = await authService.createVerificationCode(email)
      let result = await authService.verifyCode(email, code)
      expect(result).toHaveProperty('email', email)
      expect(result).toHaveProperty('code', code)
      expect(result).toHaveProperty('validUntil')
      expect(result).toHaveProperty('used', true)
      const otherCode = await authService.createVerificationCode(email)
      result = await authService.verifyCode(email, otherCode)
      expect(result).toHaveProperty('email', email)
      expect(result).toHaveProperty('code', otherCode)
      expect(result).toHaveProperty('validUntil')
      expect(result).toHaveProperty('used', true)
    })
  })
})
