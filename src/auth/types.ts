
export type CodeVerifyResult = {
  token: string
} | {
  error: string
}
export interface IAuthService {
  createVerificationCode: (email: string) => Promise<string>
  verifyCode: (email: string, code: string) => Promise<CodeVerifyResult>
}
