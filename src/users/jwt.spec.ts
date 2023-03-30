import {validateToken, createToken} from './jwt'
import {expect} from '@jest/globals'
describe('jwt', () => {
  describe('validateToken', () => {
    it('returns { "error": "invalid-token" } when given an invalid token', async () => {
      expect(validateToken('asdujasjduasdu', 'ajsidaisjd')).resolves.toEqual({error: 'invalid-token'})
      const testData = { email: 'asdjiajd', _id: 'asdasdj' }
      const testSecret = '123123'
      const token = await createToken(testData, testSecret)
      expect(validateToken(token, 'some-other-secret')).resolves.toEqual({error: 'invalid-token'})

    })
    it('returns { "error": "token-expired" } when given an expired token', (done) => {
      const testData = { email: 'asdjiajd', _id: 'asdasdj' }
      const testSecret = '123123'
      let token: string
      expect(createToken(testData, testSecret, {
        expiresIn: '1ms'
      }).then((result) => {
        token = result
        return result
      })).resolves.toBeTruthy()
      setTimeout(() => {
        expect(validateToken(token, testSecret)).resolves.toEqual({error: 'token-expired'})
        done()
      }, 500)
    })
    it('returns { "data": user } where user is the decoded token payload', async () => {
      const testData = { email: 'asdjiajd', _id: 'asdasdj' }
      const testSecret = '123123'
      const token = await createToken(testData, testSecret)
      const decodedTokenResult = await validateToken(token, testSecret)
      expect(decodedTokenResult).toHaveProperty('data')
      // @ts-ignore
      const decodedToken = decodedTokenResult.data
      expect(decodedToken).toHaveProperty('email', testData.email)
      expect(decodedToken).toHaveProperty('_id', testData._id)
    })
  })
})
