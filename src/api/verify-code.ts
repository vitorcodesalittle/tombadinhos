// Route handler to verify code and return authenticated token
//
import { NextApiRequest, NextApiResponse } from "next"
import { getAuthService } from "@/services"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, code } = req.body
  try {
    const token = await getAuthService().verifyCode(email, code)
    res.status(200).json({ data: token})
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
}
