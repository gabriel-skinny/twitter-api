import { Injectable } from "@nestjs/common";
import { EmailValidation } from "../../entities/EmailValidation";
import { Password } from "../../entities/Password";
import User from "../../entities/User";
import ErrorUserAlreadyCreated from "../../errors/userAlreadyCreated";
import AbstractEmailProvider from "../../services/emailProvider";
import AbstractEmailValidationRepository from "../../repositories/emailValidation/emailValidationRepository";
import AbstractUserRepository from "../../repositories/userRepository/userRepository";
import AbstractCryptoService from "../../util/cryptoService";
import { ValidationCode } from "../../entities/ValidationCode";
import AbstractPreUserRepository from "../../repositories/preUserRepository/preUserRepository";
import PreUser from "../../entities/PreUser";
import AbstractEmailValidationAttemptRepository from "../../repositories/emailValidationAttempt/emailValidation/emailValidationAttempt";

interface IDataProps {
    name: string;
    email: string;
    password: string;
}

@Injectable()
export class CreateAccountUseCase {
    constructor (
        private readonly cryptoService: AbstractCryptoService, 
        private readonly userRepository: AbstractUserRepository,
        private readonly preUserRepository: AbstractPreUserRepository,
        private readonly emailValidationRepository: AbstractEmailValidationRepository,
        private readonly emailValidationAttemptRepository: AbstractEmailValidationAttemptRepository,
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
            password_hash: new Password(data.password, this.cryptoService)
        });
        await this.preUserRepository.save(preUser);

        const emailValidationFounded = await this.emailValidationRepository.findByUserEmail(data.email);
        let validationCode: ValidationCode;
        if (emailValidationFounded) {
            validationCode = emailValidationFounded.validationCode;

            const emailValidationAttempt = await this.emailValidationAttemptRepository.findByEmailValidationId(emailValidationFounded.id);
            emailValidationAttempt.addAttempt();
            await this.emailValidationAttemptRepository.save(emailValidationAttempt);
        }
        else {
            validationCode = new ValidationCode();
            const emailValidation = new EmailValidation({
                userEmail: data.email,
                validationCode
            });
            await this.emailValidationRepository.save(emailValidation);
        }

        this.emailService.sendEmail({ 
            destinyEmail: data.email, 
            emailType: "emailConfirmation",
            content: `Send this validation code: ${validationCode.value}`
        });

        return { preUserId: preUser.id };
    }
}