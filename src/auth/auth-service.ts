import { CodeVerifyResult, IAuthService } from "./types";

export class AuthService implements IAuthService{
  createVerificationCode: (email: string) => Promise<string>;
  verifyCode: (email: string, code: string) => Promise<CodeVerifyResult>;
}
