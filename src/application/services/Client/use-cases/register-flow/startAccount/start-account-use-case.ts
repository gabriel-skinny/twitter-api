import { OperationToValidateTypeEnum } from "@applications/services/Client/entities/Validation/Validation";
import AbstractPreUserRepository from "@applications/services/Client/repositories/preUser/preUserRepository";
import { Injectable } from "@nestjs/common";
import ErrorUserAlreadyCreated from "../../../errors/userAlreadyCreated";
import AbstractUserRepository from "../../../repositories/user/userRepository";
import { AbstractCreateValidationCodeUseCase, CreateValidationCodeUseCase } from "../../code-validation/create/create-validation-code";
import PreUser from "@applications/services/Client/entities/User/preUser";
import { Password } from "@applications/services/Client/entities/User/Password";

interface IDataProps {
    name: string;
    email: string;
    password: string;
}

@Injectable()
export class StartAccountUseCase {
    constructor (
        private readonly userRepository: AbstractUserRepository,
        private readonly preUserRepository: AbstractPreUserRepository,
        private readonly createValidationCodeUseCase: AbstractCreateValidationCodeUseCase
    ) {}

    async execute(data: IDataProps): Promise<{ preUserId: string }> {
        if (await this.userRepository.existsByEmail(data.email)) throw new ErrorUserAlreadyCreated("email");
        if (await this.userRepository.existsByName(data.name)) throw new ErrorUserAlreadyCreated("name");
        if (await this.preUserRepository.existsByName(data.name)) throw new ErrorUserAlreadyCreated("name");

        if (await this.preUserRepository.existsByEmail(data.email)) {
            await this.preUserRepository.deleteByEmail(data.email);
        }

        const preUser = new PreUser({ 
            name: data.name, 
            email: data.email,
            password_hash: new Password(data.password)
        });
        await this.preUserRepository.save(preUser);

        await this.createValidationCodeUseCase.execute({ 
            email: data.email, 
            operationToValidateType: OperationToValidateTypeEnum.EMAIL_CONFIRMATION 
        })

        return { preUserId: preUser.id };
    }
}