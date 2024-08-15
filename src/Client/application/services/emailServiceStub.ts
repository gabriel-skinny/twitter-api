import AbstractEmailService from './emailService';

export default class EmailServiceStub implements AbstractEmailService {
  async sendEmail(data: {
    destinyEmail: string;
    emailType: 'emailConfirmation';
  }): Promise<void> {
    return;
  }
}
