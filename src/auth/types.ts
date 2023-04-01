export type VerificationCode = {
  email: string
  code: string
  validUntil: Date
  used?: boolean
}

export type CodeVerifyResult =  {
  code: string,
  email: string,
  validUntil: Date,
  used: boolean
} | {
  error: string
}
export interface IAuthService {
  createVerificationCode: (email: string) => Promise<string>
  verifyCode: (email: string, code: string) => Promise<CodeVerifyResult>
  setupIndexes: () => Promise<void>
}
