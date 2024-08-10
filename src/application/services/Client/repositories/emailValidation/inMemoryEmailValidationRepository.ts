import { EmailValidation } from "../../entities/EmailValidation";
import AbstractEmailValidationRepository from "./emailValidationRepository";


export default class InMemoryEmailValidationRepository implements AbstractEmailValidationRepository {
    public emailValidation: EmailValidation[] = [];
    
    async save(emailValidation: EmailValidation): Promise<void> {
        this.emailValidation.push(emailValidation);
    }

    async findByUserEmail(userEmail: string): Promise<EmailValidation> {
      const emailValidation = this.emailValidation.find(emailValidation => emailValidation.userEmail == userEmail);

      if (!emailValidation) return null;

      return emailValidation;
    }
}