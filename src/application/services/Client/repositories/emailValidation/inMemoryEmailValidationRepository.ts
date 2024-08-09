import { EmailValidation } from "../../entities/EmailValidation";
import AbstractEmailValidationRepository from "./emailValidationRepository";


export default class InMemoryEmailValidationRepository implements AbstractEmailValidationRepository {

    public emailValidation: EmailValidation[] = [];
    
    async save(emailValidation: EmailValidation): Promise<void> {
        this.emailValidation.push(emailValidation);
    }
}