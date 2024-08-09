import { Injectable } from "@nestjs/common";
import User from "../../entities/User";
import { Password } from "../../entities/Password";
import UserAbstractRepository  from "../../repositories/userRepository/userRepository";
import AbstractCryptoService from "../../util/cryptoService";
import ErrorUserAlreadyCreated from "../../errors/userAlreadyCreated";
import AbstractEmailProvider from "../../provider/emailProvider";
import { EmailValidation } from "../../entities/EmailValidation";
import AbstractEmailValidation from "../../repositories/emailValidation/emailValidationRepository";
import AbstractEmailValidationRepository from "../../repositories/emailValidation/emailValidationRepository";

interface IDataProps {
    name: string;
    email: string;
    password: string;
}

@Injectable()
export class CreateAccountUseCase {
    constructor (
        private readonly cryptoService: AbstractCryptoService, 
        private readonly userRepository: UserAbstractRepository,
        private readonly emailValidationRepository: AbstractEmailValidationRepository,
        private readonly emailService: AbstractEmailProvider
    ) {}

    async execute(data: IDataProps) {
        if (await this.userRepository.existsByEmail(data.email)) throw new ErrorUserAlreadyCreated("email");
        if (await this.userRepository.existsByName(data.name)) throw new ErrorUserAlreadyCreated("name");

        const user = new User({ 
            name: data.name, 
            email: data.email,
            email_validated: false,
            password_hash: new Password(data.password, this.cryptoService)
        });
        await this.userRepository.save(user);

        const emailValidation = new EmailValidation({
            userId: user.id,
        });
        await this.emailValidationRepository.save(emailValidation);
        
        this.emailService.sendEmail({ destinyEmail: data.email, emailType: "emailConfirmation"});
    }
}