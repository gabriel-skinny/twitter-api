import UserSession from 'src/Client/application/entities/User/Session';
import { UserSessionModel } from '../mongodb/schemas/userSession';

export const preUserSessionToModel = (userSession: UserSession) => {
  return new UserSessionModel({
    id: userSession.id,
    userId: userSession.userId,
    active: userSession.active,
    deviceType: userSession.deviceType,
    ip: userSession.ip,
    createdAt: userSession.createdAt,
  });
};

export const preUserSessionModelToRaw = (
  userSessionModel: UserSessionModel,
) => {
  return new UserSession({
    id: userSessionModel.id,
    userId: userSessionModel.userId,
    active: userSessionModel.active,
    deviceType: userSessionModel.deviceType,
    ip: userSessionModel.ip,
    createdAt: userSessionModel.createdAt,
  });
};
