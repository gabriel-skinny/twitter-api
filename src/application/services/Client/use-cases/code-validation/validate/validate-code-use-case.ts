import { OperationToValidateTypeEnum } from "../../../entities/Validation/Validation";
import AbstractValidationRepository from "../../../repositories/validation/validationRepository";
import { AbstractAuthService, TokenTypeEnum } from "../../../services/AuthService";

interface IValidateCodeUseCaseParams {
    userEmail: string;
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

    async execute({ userEmail, validationCode, operationToValidateType }: IValidateCodeUseCaseParams): Promise<IValidateCodeUseCaseReturn> {
        const validation = await this.validationRepository.findByUserEmail(userEmail);

        if (!validation) throw new Error("Validation does not exists for that user");

        if (validation.validationCode.value != validationCode || 
            validation.operationToValidateType != operationToValidateType
        ) 
            throw new Error("Wrong validation code");

        let jwtToken: string;
        switch(operationToValidateType) {
            case OperationToValidateTypeEnum.EMAIL_CONFIMATION: {
                jwtToken = await this.authService.makeToken({ tokenType: TokenTypeEnum.EMAIL_CONFIMATION, userEmail })
                break;
            }
            case OperationToValidateTypeEnum.PASSWORD_CHANGE: {
                jwtToken = await this.authService.makeToken({ tokenType: TokenTypeEnum.PASSWORD_CHANGE, userEmail });
                break;
            }

            default: throw new Error("Unkown operationToValidateType")
        }     
        
        await this.validationRepository.delete(validation);

        return { jwtToken }
    }
}