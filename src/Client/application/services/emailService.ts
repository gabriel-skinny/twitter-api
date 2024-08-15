export default abstract class AbstractEmailService {
  abstract sendEmail(data: {
    destinyEmail: string;
    emailType: 'emailConfirmation';
    content: string;
  }): Promise<void>;
}
