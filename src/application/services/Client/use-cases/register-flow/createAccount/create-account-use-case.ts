import { Injectable } from "@nestjs/common";
import AbstractEmailValidationRepository from "../../../repositories/validation/validationRepository";
import AbstractUserRepository from "../../../repositories/user/userRepository";
import ErrorWrongValidationCode from "../../../errors/wrongValidationCode";
import ErrorUserNotFound from "../../../errors/userNotFound";
import User from "../../../entities/User/User";
import { AbstractAuthService } from "../../../services/AuthService";
import AbstractPreUserRepository from "@applications/services/Client/repositories/preUser/preUserRepository";

interface ICreateAccountUseCaseParams {
    preUserId: string;
    validationCode: number;
}

@Injectable()
export default class CreateAccountUseCase {
    constructor(
        private readonly emailValidationRepository: AbstractEmailValidationRepository,
        private readonly preUserRepository: AbstractPreUserRepository,
        private readonly userRepository: AbstractUserRepository,
        private readonly authService: AbstractAuthService
    ) {}
    
    async execute({ preUserId, validationCode}: ICreateAccountUseCaseParams) {
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

        const userToken = await this.authService.makeLoginTokenToUser(user);

        return userToken;
    }
}