import { EmailValidation } from "../../entities/EmailValidation";
import AbstractEmailValidationRepository from "./emailValidationRepository";


export default class InMemoryEmailValidationRepository implements AbstractEmailValidationRepository {
    public emailValidation: EmailValidation[] = [];
    
    async save(emailValidation: EmailValidation): Promise<void> {
        this.emailValidation.push(emailValidation);
    }

    async findByUserId(userId: string): Promise<EmailValidation> {
      const emailValidation = this.emailValidation.find(emailValidation => emailValidation.userId == userId);

      if (!emailValidation) return null;

      return emailValidation;
    }
}