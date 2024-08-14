import AbstractUserSessionRepository from "@applications/services/Client/repositories/session/sessionRepository";
import { AbstractLogoutUseCase } from "../logout/logout-use-case";


export class LogoutAllOtherSessionsUseCase {
    constructor (
        private readonly userSessionRepository: AbstractUserSessionRepository,
        private readonly logoutUseCase: AbstractLogoutUseCase
    ) {}
    
    async execute({ userId, actualIp }: { userId: string, actualIp: string }) {
        const userSessions = await this.userSessionRepository.findAllUserSessionsByUserIdWhereNot({
            userId,
            whereNot: { ip: actualIp },
            select: { ip: true }
        });
        
        for (const userSession of userSessions) {
            await this.logoutUseCase.execute({
                ip: userSession.ip,
                userId: userId
            })
        }
    }
}