import { EmailValidation } from "../../../entities/EmailValidation";
import { ValidationCode } from "../../../entities/ValidationCode";
import AbstractEmailProvider from "../../../services/emailProvider";
import AbstractEmailValidationRepository from "../../../repositories/emailValidation/emailValidationRepository";
import AbstractEmailValidationAttemptRepository from "../../../repositories/emailValidationAttempt/emailValidation/emailValidationAttempt";
import AbstractPreUserRepository from "../../../repositories/preUserRepository/preUserRepository";


export default class ResendValidationUseCase {
    
    constructor(
        private readonly emailValidationAttemptRepository: AbstractEmailValidationAttemptRepository,
        private readonly emailValidationRepository: AbstractEmailValidationRepository,
        private readonly preUserRepository: AbstractPreUserRepository,
        private readonly emailService: AbstractEmailProvider 
    ) {}
    
    async execute(preUserId: string) {
        const preUser = await this.preUserRepository.findById(preUserId);
        let emailValidation = await this.emailValidationRepository.findByUserEmail(preUser.email);

        if (!emailValidation) {
            const newValidationCode = new ValidationCode();
            const newEmailValidation = new EmailValidation({
                userEmail: preUser.email,
                validationCode: newValidationCode
            })
        
            await this.emailValidationRepository.save(newEmailValidation);
            
            emailValidation = newEmailValidation;
        }

        if (emailValidation.validationAttempt.isOnMaxAttemps()) 
            throw new Error(`User already tried to make validation more than 5 time. Wait ${emailValidation.validationAttempt.expiresIn} minutes to retry`);

        await this.emailService.sendEmail({
            destinyEmail: preUser.email,
            emailType: "emailConfirmation",
            content: `Send this validation code: ${emailValidation.validationCode.value}`
        })

        emailValidation.validationAttempt.addAttempt();

        await this.emailValidationAttemptRepository.save(emailValidation.validationAttempt);
    }
}