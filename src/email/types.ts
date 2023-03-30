type SendingResult = {
  confirmed: boolean
}

export interface IEmailService {
  sendEmail(templatePath: string, data: unknown): Promise<SendingResult>
}
