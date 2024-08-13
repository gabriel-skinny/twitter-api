import { Injectable } from "@nestjs/common";
import { Password } from "../../../entities/Password";
import ErrorUserAlreadyCreated from "../../../errors/userAlreadyCreated";
import AbstractUserRepository from "../../../repositories/user/userRepository";
import AbstractEmailProvider from "../../../services/emailProvider";
import { ValidationCode } from "../../../entities/Validation/ValidationCode";
import PreUser from "../../../entities/PreUser";
import AbstractPreUserRepository from "@applications/services/Client/repositories/preUser/preUserRepository";
import AbstractValidationRepository from "@applications/services/Client/repositories/validation/validationRepository";
import AbstractValidationAttemptRepository from "@applications/services/Client/repositories/validationAttempt/validationAttempt";
import { OperationToValidateTypeEnum, Validation } from "@applications/services/Client/entities/Validation/Validation";

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
        private readonly validationRepository: AbstractValidationRepository,
        private readonly validationAttemptRepository: AbstractValidationAttemptRepository,
        private readonly emailService: AbstractEmailProvider
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

        const emailValidationFounded = await this.validationRepository.findByUserEmail(data.email);
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
                userEmail: data.email,
                validationCode,
                operationToValidateType: OperationToValidateTypeEnum.EMAIL_CONFIMATION
            });
            await this.validationRepository.save(validation);
        }

        this.emailService.sendEmail({ 
            destinyEmail: data.email, 
            emailType: "emailConfirmation",
            content: `Send this validation code: ${validationCode.value}`
        });

        return { preUserId: preUser.id };
    }
}