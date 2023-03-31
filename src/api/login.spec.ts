import { mockNextApiRequest, mockNextApiResponse } from "test/utils/nextapi-mocks"
import loginHandler from '@/api/login'
import { NextApiResponse } from "next"

describe('/api/login', () => {
  it('Sends login link and code to email', async () => {
    const req = mockNextApiRequest({
      body: {
        email: 'vitormaia1890@gmail.com'
      }
    })
    let res = mockNextApiResponse()
    console.info({req, res})
    await loginHandler(req, res as unknown as NextApiResponse)
    expect(res.json.mock.lastCall).toEqual([{
      data: {
        message: "Email sent",
      }
    }])
    expect(res.status.mock.lastCall).toEqual([200])
  })


  it('Returns invalid request when email is not in config.allowedEmails', async () => {
  })
})
