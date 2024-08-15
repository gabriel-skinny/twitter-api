import { Injectable } from '@nestjs/common';
import AbstractEmailService from 'src/Client/application/services/emailService';

@Injectable()
export default class EmailService implements AbstractEmailService {
  async sendEmail(data: {
    destinyEmail: string;
    emailType: 'emailConfirmation';
    content: string;
  }): Promise<void> {
    console.log('Email sent', data);
  }
}
