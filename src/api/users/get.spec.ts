import { UserDbElastic } from "@/users/users-db-elastic"
import getMeHandler from './get'
import { mockNextApiRequest, mockNextApiResponse } from "test/utils/nextapi-mocks"
import { createToken } from "@/users/jwt"
import { config } from "@/config"
import { getEsConfig } from "@/places/places-db-elastic"

describe('/api/users', () => {
  let userDb: UserDbElastic
  beforeAll(async () => {
    userDb = new UserDbElastic(getEsConfig(config))
  })
  it('returns user decoded by token', async () => {
    // creates mocked user
    const user = await userDb.create({
      email: 'vitormaia1890@gmail.com',
    })
    // mock jwt token
    const token = await createToken({
      _id: user._id,
      email: user.email,
    }, config.secret)
    
    // mocks nextjs request and response
    const req = mockNextApiRequest({
      headers: {
        authorization: token,
      }
    });
    const res = mockNextApiResponse();
    console.info('test user', user)
    await getMeHandler(req, res)
    // expect res.json is called on { data: { email: string, _id: string } }
    expect(res.json).toHaveBeenLastCalledWith({ data: { email: user.email, _id: user._id, iat: expect.any(Number) } })
    // expect res.status is called on 200
    expect(res.status).toHaveBeenCalledWith(200)
  })
})
