import { Injectable } from "@nestjs/common";
import AbstractEmailValidationRepository from "../../repositories/emailValidation/emailValidationRepository";
import AbstractUserRepository from "../../repositories/userRepository/userRepository";
import ErrorWrongValidationCode from "../../errors/wrongValidationCode";
import ErrorUserNotFound from "../../errors/userNotFound";

interface IValidateEmailUseCasesParams {
    userId: string;
    validationCode: number;
}

@Injectable()
export default class ValidateEmailUseCase {
    constructor(
        private readonly emailValidationRepository: AbstractEmailValidationRepository,
        private readonly userRepository: AbstractUserRepository
    ) {}
    
    async execute({ userId, validationCode}: IValidateEmailUseCasesParams) {
        const emailValidation = await this.emailValidationRepository.findByUserId(userId);
        const user = await this.userRepository.findById(userId);

        if (!user) throw new ErrorUserNotFound();

        if (emailValidation == null || emailValidation.validationCode.value !== validationCode) 
            throw new ErrorWrongValidationCode();

        user.validateEmail();

        await this.userRepository.save(user);
    }
}