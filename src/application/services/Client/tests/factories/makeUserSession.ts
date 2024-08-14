

import UserSession, { SessionDeviceTypesEnum } from "../../entities/User/Session";

export const makeUserSession = (props?: Partial<UserSession>) => {
    return new UserSession({
        ip: "124.131.132",
        userId: "userId",
        deviceType: SessionDeviceTypesEnum.DESKTOP,
        ...props
    });
}