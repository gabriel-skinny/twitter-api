import { EmailValidationAttempt } from "@applications/services/Client/entities/EmailValidationAttempt";
import AbstractEmailValidationAttemptRepository from "./emailValidationAttempt";


export default class InMemoryEmailValidationAttemptRepository implements AbstractEmailValidationAttemptRepository {
    public emailValidationAttempDatabase: EmailValidationAttempt[] = [];
    
    async save(emailValidation: EmailValidationAttempt): Promise<void> {
        this.emailValidationAttempDatabase.push(emailValidation);
    }

    async findByEmailValidationId(emailValidationId: string): Promise<EmailValidationAttempt> {
      const emailValidation = this.emailValidationAttempDatabase.find(emailValidation => emailValidation.emailValidationId == emailValidationId);

      if (!emailValidation) return null;

      return emailValidation;
    }
}