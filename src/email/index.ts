import { IEmailService, SendEmailOptions, SendEmailResult } from "./types";

export class EmailService implements IEmailService {
  sendEmail(arg0: SendEmailOptions): Promise<SendEmailResult> {
    throw new Error("Method not implemented.");
  }
}
