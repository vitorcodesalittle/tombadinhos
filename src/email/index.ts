import { config } from "@/config";
import { IEmailService, SendEmailOptions, SendEmailResult } from "./types";

export class EmailService implements IEmailService {
  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    const { data, email, templatePath } = options
    const { code, link } = data
    const html = `
    <p>Olá!</p>
    <br/>
    <br/>
    <p>Viemos trazer seu código de verificação: ${code}.</p>
    <br/>
    <p>Ou clique nesse link: <a href="${link}">${link}</a></p>
    <br/>
    <p>Ele é válido por 2 horas, não compartilhe com ninguém!</p>
    <br/>
    <br/>

    <p>Obrigado por sua particiação!</p>
    <br/>

    <span>Esse email é automático, por favor não responda.</span>
    `

    if (config.environment === 'development') {
      console.info(`
Verification code: ${code}
Auth link:         ${link}
`)
    }

    return {
      confirmed: true
    }
  }
}
