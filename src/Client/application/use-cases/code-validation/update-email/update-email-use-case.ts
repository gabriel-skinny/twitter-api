import { OperationToValidateTypeEnum } from "src/Client/application/entities/Validation/Validation";
import AbstractValidationRepository from "../../../repositories/validation/validationRepository";

export interface IUpdateEmailCodeValidationUseCaseParams {
    newEmail: string; 
    oldEmail: string;
    operationToValidateType: OperationToValidateTypeEnum;
}

export abstract class AbstractUpdateEmailCodeValidationUseCase {
    abstract execute(data: IUpdateEmailCodeValidationUseCaseParams): Promise<void>;
}

export class UpdateEmailCodeValidationUseCase extends AbstractUpdateEmailCodeValidationUseCase {
    constructor(private readonly validationRepository: AbstractValidationRepository) {
        super();
    }
    
    async execute({ newEmail, oldEmail, operationToValidateType }: IUpdateEmailCodeValidationUseCaseParams) {
        const validation = await this.validationRepository.findByEmailAndOperation({
            email: oldEmail,
            operationToValidateType
        });
        
        if (!validation) throw new Error("That validation does not exists for that email")
            
        validation.email = newEmail;
        await this.validationRepository.save(validation);
    }
}