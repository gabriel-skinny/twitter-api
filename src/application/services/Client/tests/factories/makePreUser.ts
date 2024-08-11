import { Password } from "../../entities/Password";
import PreUser from "../../entities/PreUser";
import User from "../../entities/User";
import CryptoServiceStub from "../../util/cryptoServiceStub";

export const makePreUser = (props?: Partial<PreUser>) => {
    const cryptoServiceStub = new CryptoServiceStub();
    return new PreUser({
        name: "gabriel",
        email: "gabriel",
        password_hash: new Password("password", cryptoServiceStub),
        ...props
    });
}