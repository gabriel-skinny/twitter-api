import { OperationToValidateTypeEnum } from "../../../entities/Validation/Validation";
import AbstractValidationRepository from "../../../repositories/validation/validationRepository";
import { AbstractAuthService, TokenTypeEnum } from "../../../services/AuthService";

interface IValidateCodeUseCaseParams {
    email: string;
    validationCode: number;
    operationToValidateType : OperationToValidateTypeEnum
}

interface IValidateCodeUseCaseReturn {
    jwtToken: string;
}

export default class ValidateCodeUseCase {
    constructor(
        private readonly validationRepository: AbstractValidationRepository,
        private readonly authService: AbstractAuthService
    ) {}

    async execute({ email, validationCode, operationToValidateType }: IValidateCodeUseCaseParams): Promise<IValidateCodeUseCaseReturn> {
        const validation = await this.validationRepository.findByEmailAndOperation({
            email,
            operationToValidateType
        });

        if (!validation) throw new Error("Validation does not exists for that email");

        if (validation.validationCode.value != validationCode) 
            throw new Error("Wrong validation code");

        let jwtToken: string;
        switch(operationToValidateType) {
            case OperationToValidateTypeEnum.EMAIL_CONFIRMATION: {
                jwtToken = await this.authService.makeToken({ tokenType: TokenTypeEnum.EMAIL_CONFIRMATION, userEmail: email })
                break;
            }
            case OperationToValidateTypeEnum.PASSWORD_CHANGE: {
                jwtToken = await this.authService.makeToken({ tokenType: TokenTypeEnum.PASSWORD_CHANGE, userEmail: email });
                break;
            }

            default: throw new Error("Unkown operationToValidateType")
        }     
        
        await this.validationRepository.delete(validation);

        return { jwtToken }
    }
}