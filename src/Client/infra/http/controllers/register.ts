import { Body, Controller, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import UpdateAccountUseCase from "src/Client/application/use-cases/login-flow/updateAccount/update-account-use-case";
import CreateAccountUseCase from "src/Client/application/use-cases/register-flow/createAccount/create-account-use-case";
import { StartAccountUseCase } from "src/Client/application/use-cases/register-flow/startAccount/start-account-use-case";
import { BaseControllerMethodInterface } from "../interface/baseController";
import { CreateUserDto } from "../dto/user";

@Controller("register")
export class RegisterController {

    constructor(
        private readonly createAccountUseCase: CreateAccountUseCase,
        private readonly startAccountUseCase: StartAccountUseCase,
        private readonly updateAccountUseCase: UpdateAccountUseCase
    ) {}

    @Post("create-account")
    async createAccount(@Param("id") preUserId: string): Promise<BaseControllerMethodInterface<{loginToken: string}>> {
        const { loginToken } = await this.createAccountUseCase.execute(preUserId);
    
        return { 
            statusCode: HttpStatus.CREATED, 
            data: { loginToken },
            message: "Account created"
        }
    }

    @Post("start-account")
    async startAccount(@Body() { email, name, password }: CreateUserDto): Promise<BaseControllerMethodInterface<{ preUserId: string }>> {
        const { preUserId } = await this.startAccountUseCase.execute({
            email,
            name,
            password
        });

        return { 
            message: "Account started",
            statusCode: HttpStatus.CREATED,
            data: { preUserId } 
        };
    }

    @Patch("update-account")
    async updateAccount(@Param("id") id: string, @Body() userData: {}): Promise<BaseControllerMethodInterface> {
        await this.updateAccountUseCase.execute({ id, userData });

        return { 
            statusCode: HttpStatus.CREATED,
            message: "Updated sucessfully"
        }
    }
}