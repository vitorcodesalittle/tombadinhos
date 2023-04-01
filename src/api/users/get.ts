// A NextJS API route that handle a user request
import { NextApiRequest, NextApiResponse } from 'next'
import { IUserService } from '@/users/types'
import { getUserService } from '@/services'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get token from Authorization header
  const token = req.headers.authorization
  try {
    const user = await getUserService().get(token)
    res.status(200).json({
      data: user
    })
  } catch (error) {
    res.status(500).json({ error })
  }
}
