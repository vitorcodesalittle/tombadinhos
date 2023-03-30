import { User, UserBasic } from "./types";
import { JsonWebTokenError, JwtPayload, NotBeforeError, SignOptions, TokenExpiredError, VerifyOptions, sign, verify } from 'jsonwebtoken'

export const createToken = async (user: UserBasic, secret: string, options?: SignOptions): Promise<string> => {
  return sign(user, secret, options)
}

type JWTError = 'invalid-token' | 'token-expired' | 'unknown-error'
export const validateToken = async (token: string, secret: string, options?: VerifyOptions): Promise<{ data?: User, error?: JWTError }> => {
  try {
    const payload = verify(token, secret, options) as JwtPayload & User
    return { data: payload }
  } catch (err) {
    if (err instanceof TokenExpiredError || err instanceof NotBeforeError) {
      return {
        error: 'token-expired'
      }
    } else if (err instanceof JsonWebTokenError) {
      return { error: 'invalid-token' }
    }
    return { error: 'unknown-error' }
  }
}
