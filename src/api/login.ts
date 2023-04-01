// A NextJS API route that handles login request
import { NextApiRequest, NextApiResponse } from 'next'
import { UserService } from '@/users/users-service'
import { getUserService } from '@/services'
import { ApiError } from '@/apiError'
import { UserServiceError } from '@/users/errors'

let apiURL = 'http://localhost:8080'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body
  try {
    const confirmed = await getUserService().verifyEmail(email)
    if (confirmed)
      res.status(200).json({
        "message": "Email sent"
      })
    else {
      res.status(500).json({
        "message": "Failed to send verification link through email"
      })
    }
  } catch (error) {
    console.error(error)
    console.error(error instanceof ApiError)
    if (error instanceof ApiError) {
      if (error.code === UserServiceError.EmailNotListed)
        return res.status(400).json({code: error.code, message: error.message})
    }
    res.status(500).json({ error })
  }
}
