import CryptoServiceStub from "../adapters/cryptoServiceStub";
import { Password } from "./Password";

describe("User entity test", () => {
    it ("should create a password_hash", () => {
        const cryptoServiceStub = new CryptoServiceStub();
        const passwordSent = "password"
        const password =  new Password(passwordSent, cryptoServiceStub)
        
        expect(password).toBeTruthy();
        expect(password.value).not.toBe(passwordSent);
    })

    it ("should not hash a password if it is already hashed", () => {
        const cryptoServiceStub = new CryptoServiceStub();
        const passwordSent = "hashedValue"
        const password =  new Password(passwordSent, cryptoServiceStub)
        
        expect(password).toBeTruthy();
        expect(password.value).toBe(passwordSent);
    })
})