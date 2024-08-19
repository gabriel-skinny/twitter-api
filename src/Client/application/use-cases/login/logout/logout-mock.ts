import { AbstractLogoutUseCase, ILogoutUseCaseParams } from "./logout-use-case";

export class LogoutMockUseCase extends AbstractLogoutUseCase {
    async execute(data: ILogoutUseCaseParams): Promise<void> {}
}