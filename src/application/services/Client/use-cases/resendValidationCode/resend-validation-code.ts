import { ValidationCode } from "../../entities/ValidationCode";
import AbstractEmailProvider from "../../provider/emailProvider";
import AbstractEmailValidationRepository from "../../repositories/emailValidation/emailValidationRepository";
import AbstractEmailValidationAttemptRepository from "../../repositories/emailValidationAttempt/emailValidation/emailValidationAttempt";
import AbstractUserRepository from "../../repositories/userRepository/userRepository";


export default class ResendValidationUseCase {
    
    constructor(
        private readonly emailValidationAttemptRepository: AbstractEmailValidationAttemptRepository,
        private readonly emailValidationRepository: AbstractEmailValidationRepository,
        private readonly userRepository: AbstractUserRepository,
        private readonly emailService: AbstractEmailProvider 
    ) {}
    
    async execute(userId: string) {
        const emailValidationAttempt = await this.emailValidationAttemptRepository.findByUserId(userId);
        if (emailValidationAttempt.isOnMaxAttemps()) throw new Error("User already tried to make validation more than 5 times");

        const user = await this.userRepository.findById(userId);
        const emailValidation = await this.emailValidationRepository.findByUserId(userId);


        if (emailValidationAttempt.isExpired()) {
            const newValidationCode = new ValidationCode();
            emailValidation.validationCode = newValidationCode;
        
            await this.emailValidationRepository.save(emailValidation);
        }

        await this.emailService.sendEmail({
            destinyEmail: user.email,
            emailType: "emailConfirmation",
            content: `Send this validation code: ${emailValidation.validationCode.value}`
        })

        emailValidationAttempt.addAttempt();

        await this.emailValidationAttemptRepository.save(emailValidationAttempt);
    }
}