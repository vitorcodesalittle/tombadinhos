// A NextJS API route that handles login request
import { NextApiRequest, NextApiResponse } from 'next'
import { VerificationCodeAuth } from '@/auth/types'
import { IEmailService } from '@/email/types'

let authService: VerificationCodeAuth
let emailService: IEmailService
let apiURL = 'http://localhost:8080'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body
  try {
    const code = await authService.createVerificationCode(email)
    const emailresult = await emailService.sendEmail(
      'templates/account-verify',
      {
        url: `${apiURL}/verify?token=${code}&email=${email}`
      }
    )
    if (emailresult.confirmed)
      res.status(200).json({
        "message": "Email send"
      })
    else {
      res.status(500).json({
        "message": "Failed to send verification link through email"
      })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}
