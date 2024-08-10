import { EmailValidationAttempt } from "@applications/services/Client/entities/EmailValidationAttempt";
import AbstractEmailValidationAttemptRepository from "./emailValidationAttempt";


export default class InMemoryAbstractEmailValidationAttemptRepository implements AbstractEmailValidationAttemptRepository {
    public emailValidationAttempDatabase: EmailValidationAttempt[] = [];
    
    async save(emailValidation: EmailValidationAttempt): Promise<void> {
        this.emailValidationAttempDatabase.push(emailValidation);
    }

    async findByUserId(userId: string): Promise<EmailValidationAttempt> {
      const emailValidation = this.emailValidationAttempDatabase.find(emailValidation => emailValidation.userId == userId);

      if (!emailValidation) return null;

      return emailValidation;
    }
}