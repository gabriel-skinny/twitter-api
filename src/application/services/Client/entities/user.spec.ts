import CryptoServiceStub from "../util/cryptoServiceStub";
import { Password } from "./Password";
import User from "./User"

describe("User entity test", () => {
    it ("should create a user", () => {
        const cryptoServiceStub = new CryptoServiceStub();
        const user = new User({
            name: "gabriel",
            email: "gabriel",
            email_validated: true,
            password_hash: new Password("password", cryptoServiceStub)
        });

        expect(user).toBeTruthy();
    })
})