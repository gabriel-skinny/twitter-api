import { Injectable } from "@nestjs/common";
import ErrorUserAlreadyCreated from "../../errors/userAlreadyCreated";
import AbstractEmailProvider from "../../services/emailProvider";
import AbstractEmailValidationRepository from "../../repositories/emailValidation/emailValidationRepository";
import AbstractEmailValidationAttemptRepository from "../../repositories/emailValidationAttempt/emailValidation/emailValidationAttempt";
import AbstractPreUserRepository from "../../repositories/preUserRepository/preUserRepository";
import AbstractUserRepository from "../../repositories/userRepository/userRepository";
import ErrorUserNotFound from "../../errors/userNotFound";

interface IDataProps {
    preUserId: string;
    newEmail: string;
}

@Injectable()
export class ChangeValidationEmailUseCase {
    constructor (
        private readonly userRepository: AbstractUserRepository,
        private readonly preUserRepository: AbstractPreUserRepository,
        private readonly emailValidationRepository: AbstractEmailValidationRepository,
    ) {}

    async execute(data: IDataProps): Promise<void> {
        if (await this.userRepository.existsByEmail(data.newEmail)) throw new ErrorUserAlreadyCreated("email");    
        if (await this.preUserRepository.existsByEmail(data.newEmail)) throw new ErrorUserAlreadyCreated("email");

        const preUser = await this.preUserRepository.findById(data.preUserId);

        if (!preUser) throw new ErrorUserNotFound();

        const emailValidation = await this.emailValidationRepository.findByUserEmail(preUser.email);
        if (emailValidation) {
            emailValidation.userEmail = data.newEmail;
            await this.emailValidationRepository.save(emailValidation);
        }

        preUser.email = data.newEmail;
        await this.preUserRepository.save(preUser);
    }
}