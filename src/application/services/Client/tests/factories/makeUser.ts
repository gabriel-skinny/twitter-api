import { Password } from "../../entities/Password";
import User from "../../entities/User";
import CryptoServiceStub from "../../util/cryptoServiceStub";

export const makeUser = () => {
    const cryptoServiceStub = new CryptoServiceStub();
    return new User({
        name: "gabriel",
        email: "gabriel",
        email_validated: true,
        password_hash: new Password("password", cryptoServiceStub)
    });
}