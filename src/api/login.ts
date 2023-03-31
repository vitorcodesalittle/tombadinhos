// A NextJS API route that handles login request
import { NextApiRequest, NextApiResponse } from 'next'
import { UserService } from '@/users/users-service'
import { usersService } from '@/services'

let apiURL = 'http://localhost:8080'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body
  try {
    const confirmed = await usersService().verifyEmail(email)
    if (confirmed)
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
