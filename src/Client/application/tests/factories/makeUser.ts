
import { Password } from "../../entities/User/Password";
import User from "../../entities/User/User";

export const makeUser = (props?: Partial<User>) => {
    return new User({
        name: "gabriel",
        email: "gabriel@gmail.com",
        password_hash: new Password("password"),
        ...props
    });
}