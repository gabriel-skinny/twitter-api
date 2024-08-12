import { Password } from "../../entities/Password";
import PreUser from "../../entities/PreUser";

export const makePreUser = (props?: Partial<PreUser>) => {
    return new PreUser({
        name: "gabriel",
        email: "gabriel",
        password_hash: new Password("password"),
        ...props
    });
}