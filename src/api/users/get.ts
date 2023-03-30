// A NextJS API route that handle a user request
import { NextApiRequest, NextApiResponse } from 'next'
import { IUserService } from '@/users/types'

let userService: IUserService

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.body
  try {
    const user = await userService.get(token)
    res.status(200).json({
      data: user
    })
  } catch (error) {
    res.status(500).json({ error })
  }
}
