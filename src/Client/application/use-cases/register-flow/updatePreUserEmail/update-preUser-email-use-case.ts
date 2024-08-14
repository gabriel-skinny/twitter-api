import AbstractPreUserRepository from "src/Client/application/repositories/preUser/preUserRepository";
import { Injectable } from "@nestjs/common";
import ErrorUserAlreadyCreated from "../../../errors/userAlreadyCreated";
import ErrorUserNotFound from "../../../errors/userNotFound";
import AbstractUserRepository from "../../../repositories/user/userRepository";
import { AbstractUpdateEmailCodeValidationUseCase } from "../../code-validation/update-email/update-email-use-case";
import { OperationToValidateTypeEnum } from "src/Client/application/entities/Validation/Validation";

interface IDataProps {
    preUserId: string;
    newEmail: string;
}

@Injectable()
export class UpdatePreUserEmailUseCase {
    constructor (
        private readonly userRepository: AbstractUserRepository,
        private readonly preUserRepository: AbstractPreUserRepository,
        private readonly updateEmailCodeValidationUseCase: AbstractUpdateEmailCodeValidationUseCase
    ) {}

    async execute(data: IDataProps): Promise<void> {
        if (await this.userRepository.existsByEmail(data.newEmail)) throw new ErrorUserAlreadyCreated("email");    
        if (await this.preUserRepository.existsByEmail(data.newEmail)) throw new ErrorUserAlreadyCreated("email");

        const preUser = await this.preUserRepository.findById(data.preUserId);

        if (!preUser) throw new ErrorUserNotFound();

        await this.updateEmailCodeValidationUseCase.execute({ 
            newEmail: data.newEmail, 
            oldEmail: preUser.email,
            operationToValidateType: OperationToValidateTypeEnum.EMAIL_CONFIRMATION 
        });

        preUser.email = data.newEmail;
        await this.preUserRepository.save(preUser);
    }
}