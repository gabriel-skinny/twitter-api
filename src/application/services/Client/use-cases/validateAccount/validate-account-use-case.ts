import { Injectable } from "@nestjs/common";
import AbstractEmailValidationRepository from "../../repositories/emailValidation/emailValidationRepository";
import AbstractUserRepository from "../../repositories/userRepository/userRepository";
import ErrorWrongValidationCode from "../../errors/wrongValidationCode";
import ErrorUserNotFound from "../../errors/userNotFound";
import AbstractPreUserRepository from "../../repositories/preUserRepository/preUserRepository";
import User from "../../entities/User";
import { AbstractAuthService } from "../../services/AuthService";

interface IValidateAccountUseCasesParams {
    preUserId: string;
    validationCode: number;
}

@Injectable()
export default class ValidateAccountUseCase {
    constructor(
        private readonly emailValidationRepository: AbstractEmailValidationRepository,
        private readonly preUserRepository: AbstractPreUserRepository,
        private readonly userRepository: AbstractUserRepository,
        private readonly authService: AbstractAuthService
    ) {}
    
    async execute({ preUserId, validationCode}: IValidateAccountUseCasesParams) {
        const preUser = await this.preUserRepository.findById(preUserId);
        
        if (!preUser) throw new ErrorUserNotFound();

        const emailValidation = await this.emailValidationRepository.findByUserEmail(preUser.email);

        if (emailValidation == null || emailValidation.validationCode.value !== validationCode) 
            throw new ErrorWrongValidationCode();

        const user = new User({
            name: preUser.name,
            email: preUser.email,
            password_hash: preUser.password_hash
        });

        await this.userRepository.save(user);

        const userToken = await this.authService.makeAuthTokenToUser(user);

        return userToken;
    }
}