import { Injectable } from '@nestjs/common';
import AbstractEmailService from 'src/Client/application/services/emailService';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export default class EmailService implements AbstractEmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail({
    destinyEmail,
    emailType,
    content,
  }: {
    destinyEmail: string;
    emailType: 'emailConfirmation';
    content: string;
  }): Promise<void> {
    console.log({ emailSent: { destinyEmail, emailType, content } });
    /* await this.mailerService.sendMail({
      from: 'mailtrap@example.com',
      to: 'gabrielcatoni12@gmail.com',
      subject: emailType,
      text: content,
    }); */
  }
}
