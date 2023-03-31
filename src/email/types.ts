type SendingResult = {
  confirmed: boolean
}

export interface SendEmailOptions { templatePath: string; email: any; data: { code: string; link: string } }
export interface SendEmailResult { confirmed: boolean }

export interface IEmailService {
    sendEmail(arg0: SendEmailOptions): Promise<SendEmailResult>;
}
