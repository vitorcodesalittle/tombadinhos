export interface CodeVerifyResult {
  confirmed: boolean
}
export interface VerificationCodeAuth {
  createVerificationCode: (email: string) => Promise<string>
  verifyCode: (email: string, code: string) => Promise<CodeVerifyResult>
}
