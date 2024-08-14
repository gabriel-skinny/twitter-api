import { Password } from "../../entities/User/Password";
import PreUser from "../../entities/User/preUser";


export const makePreUser = (props?: Partial<PreUser>) => {
    return new PreUser({
        name: "gabriel",
        email: "gabriel",
        password_hash: new Password("password"),
        ...props
    });
}