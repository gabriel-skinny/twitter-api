import AbstractUserSessionRepository from "@applications/services/Client/repositories/session/sessionRepository";

export interface ILogoutUseCaseParams { userId: string, ip: string }

export abstract class AbstractLogoutUseCase {
    abstract execute(data: ILogoutUseCaseParams): Promise<void>
}

export default class LogoutUseCase extends AbstractLogoutUseCase {
    constructor (
        private readonly userSessionRepository: AbstractUserSessionRepository 
    ) { super() }

    async execute({ userId, ip }: ILogoutUseCaseParams) {
        const userSession = await this.userSessionRepository.findByUserIdAndIp({
            userId,
            ip
        });

        if (!userSession) throw new Error("User session not found");

        await this.userSessionRepository.delete(userSession.id);
    }
}