import { Password } from "../../entities/Password";
import User from "../../entities/User";
import CryptoServiceStub from "../../util/cryptoServiceStub";

export const makeUser = (props?: Partial<User>) => {
    const cryptoServiceStub = new CryptoServiceStub();
    return new User({
        name: "gabriel",
        email: "gabriel",
        password_hash: new Password("password", cryptoServiceStub),
        ...props
    });
}