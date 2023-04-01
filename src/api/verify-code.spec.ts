import { AuthService } from "@/auth/auth-service"
import { User } from "@/users/types"
import { UserDbElastic } from "@/users/users-db-elastic"
import { beforeAll } from "@jest/globals"
import verifyHandler from './verify-code'
import { getEsConfig } from "@/places/places-db-elastic"
import { config } from "@/config"
import { mockNextApiRequest, mockNextApiResponse } from "test/utils/nextapi-mocks"

describe('/api/verify-code', () => {
  let usersDb: UserDbElastic
  let user: User
  let authService: AuthService

  beforeAll(async () => {
    usersDb = new UserDbElastic(getEsConfig(config))
    authService = new AuthService(getEsConfig(config))
    // create mocked user
    user = await usersDb.create({
      email: 'vitormaia1890@gmail.com',
    })
  })
  it('returns jwt token if code and email match and code is not expired', async () => {
    // creates code
    const verificationCode = await authService.createVerificationCode(user.email)
    // mocks nextjs request and response
    const req = mockNextApiRequest({
      body: {
        email: user.email,
        code: verificationCode,
      }
    });
    const res = mockNextApiResponse();
    await verifyHandler(req, res)
    // assert res.status was called with status 200
    expect(res.status).toHaveBeenCalledWith(200)
    // assert res.json last call was on { data: { code: string, email: string, used: true, validUntil: Date } } object
    expect(res.json).toHaveBeenLastCalledWith({ data: { code: verificationCode, email: user.email, used: true, validUntil: expect.any(Date) } })
  })

  it('when code is expired returns ApiError with CodeExpired', async () => {
    // TODO
  })

  it('returns invalid request when email does not match code or code is missing', async () => {
    // TODO
  })
})
