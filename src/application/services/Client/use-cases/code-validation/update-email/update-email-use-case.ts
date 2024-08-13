import AbstractValidationRepository from "../../../repositories/validation/validationRepository";

export default class UpdateEmailCodeValidationUseCase {
    constructor(private readonly validationRepository: AbstractValidationRepository) {}
    
    async execute({ newEmail, oldEmail }: {newEmail: string; oldEmail: string}) {
        const emailValidation = await this.validationRepository.findByUserEmail(oldEmail);
        if (emailValidation) {
            emailValidation.userEmail = newEmail;
            await this.validationRepository.save(emailValidation);
        }
    }
}