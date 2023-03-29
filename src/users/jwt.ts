import { User, UserBasic } from "./types";
import {Jwt, JwtPayload, SignOptions, VerifyOptions, sign, verify} from 'jsonwebtoken'

export const createToken = async (user: UserBasic, secret: string, options?: SignOptions): Promise<string> => {
  return sign(user, secret, options)
}

export const validateToken = async (token: string, secret: string, options?: VerifyOptions): Promise<User> => {
  const payload = verify(token, secret, options) as JwtPayload
  console.info('payload', payload)
  return payload as User & JwtPayload
}
