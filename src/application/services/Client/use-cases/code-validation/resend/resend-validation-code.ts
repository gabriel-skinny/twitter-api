import { OperationToValidateTypeEnum } from "@applications/services/Client/entities/Validation/Validation";
import AbstractValidationRepository from "@applications/services/Client/repositories/validation/validationRepository";
import AbstractEmailProvider from "@applications/services/Client/services/emailProvider";

export interface IResendValidationCodeParams { 
    email: string, 
    operationToValidateType: OperationToValidateTypeEnum 
}

export abstract class AbstractResendValidationUseCase {
    abstract execute(data: IResendValidationCodeParams): Promise<void>;
}

export class ResendValidationUseCase extends AbstractResendValidationUseCase {
    
    constructor(
        private readonly validationRepository: AbstractValidationRepository,
        private readonly emailService: AbstractEmailProvider 
    ) { super() }
    
    async execute({ email, operationToValidateType }: IResendValidationCodeParams) {
        const validation = await this.validationRepository.findByEmailAndOperation({
            email,
            operationToValidateType
        });

        if (!validation) throw new Error("Validation does not exists for that user");

        await this.emailService.sendEmail({
            destinyEmail: email,
            emailType: "emailConfirmation",
            content: `Send this validation code: ${validation.validationCode.value}`
        })
    }
}