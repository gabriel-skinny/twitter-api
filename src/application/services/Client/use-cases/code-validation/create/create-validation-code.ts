import { OperationToValidateTypeEnum, Validation } from "../../../entities/Validation/Validation";
import { ValidationCode } from "../../../entities/Validation/ValidationCode";
import AbstractValidationRepository from "../../../repositories/validation/validationRepository";
import AbstractValidationAttemptRepository from "../../../repositories/validationAttempt/validationAttempt";

export class CreateValidationCodeUseCase {
    constructor(
        private readonly validationRepository: AbstractValidationRepository,
        private readonly validationAttemptRepository: AbstractValidationAttemptRepository
    ) {}

    async execute({ email, operationToValidateType }: { email: string, operationToValidateType: OperationToValidateTypeEnum }) {
        const emailValidationFounded = await this.validationRepository.findByUserEmail(email);
        let validationCode: ValidationCode;
        if (emailValidationFounded) {
            validationCode = emailValidationFounded.validationCode;

            const emailValidationAttempt = await this.validationAttemptRepository.findByValidationId(emailValidationFounded.id);
            emailValidationAttempt.addAttempt();
            await this.validationAttemptRepository.save(emailValidationAttempt);
        }
        else {
            validationCode = new ValidationCode();
            const validation = new Validation({
                userEmail: email,
                validationCode,
                operationToValidateType: operationToValidateType
            });
            await this.validationRepository.save(validation);
        }
    }
}