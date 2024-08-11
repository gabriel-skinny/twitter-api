import { EmailValidation } from "../../entities/EmailValidation";
import AbstractEmailValidationRepository from "./emailValidationRepository";


export default class InMemoryEmailValidationRepository implements AbstractEmailValidationRepository {
    public emailValidationDatabase: EmailValidation[] = [];
    
    async save(emailValidation: EmailValidation): Promise<void> {
        this.emailValidationDatabase.push(emailValidation);
    }

    async findByUserEmail(userEmail: string): Promise<EmailValidation> {
      const emailValidation = this.emailValidationDatabase.find(emailValidation => emailValidation.userEmail == userEmail);

      if (!emailValidation) return null;

      return emailValidation;
    }
}