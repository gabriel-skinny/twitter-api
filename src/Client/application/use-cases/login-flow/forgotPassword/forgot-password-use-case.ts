import ErrorUserNotFound from "src/Client/application/errors/userNotFound";
import AbstractUserRepository from "src/Client/application/repositories/user/userRepository";
import { AbstractCreateValidationCodeUseCase } from "../../code-validation/create/create-validation-code";
import { OperationToValidateTypeEnum } from "src/Client/application/entities/Validation/Validation";

export class ForgotPasswordUseCase {
    constructor (
        private readonly userRepository: AbstractUserRepository,
        private readonly createValidationUseCase: AbstractCreateValidationCodeUseCase
    ) {}
    
    async execute(userEmail: string) {    
        if (!await this.userRepository.existsByEmail(userEmail)) throw new ErrorUserNotFound();

        await this.createValidationUseCase.execute({
            email: userEmail,
            operationToValidateType: OperationToValidateTypeEnum.PASSWORD_CHANGE
        })
    }
}