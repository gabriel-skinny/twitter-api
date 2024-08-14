import ErrorUserNotFound from "@applications/services/Client/errors/userNotFound";
import AbstractUserRepository from "@applications/services/Client/repositories/user/userRepository";
import { AbstractCreateValidationCodeUseCase } from "../../code-validation/create/create-validation-code";
import { OperationToValidateTypeEnum } from "@applications/services/Client/entities/Validation/Validation";

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