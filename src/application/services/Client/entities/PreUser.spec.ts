import CryptoServiceStub from "../adapters/cryptoServiceStub";
import { Password } from "./Password";
import PreUser from "./preUser";

describe("PreUser entity test", () => {
    it ("should create a PreUser", () => {
        const cryptoServiceStub = new CryptoServiceStub();
        const passwordSent = "hashedValue"
        const password =  new Password(passwordSent, cryptoServiceStub)
        
        const userData = {
            email: "teste@gmail",
            name: "name",
            password_hash: password
        }
        
        const preUser =  new PreUser(userData)
        
        expect(preUser).toBeTruthy();
    })

    it ("should have all values", () => {
        const cryptoServiceStub = new CryptoServiceStub();
        const passwordSent = "hashedValue"
        const password =  new Password(passwordSent, cryptoServiceStub)
        
        const userData = {
            email: "teste@gmail",
            name: "name",
            password_hash: password
        }
        
        const preUser =  new PreUser(userData)
        
        expect(preUser.id).toBeTruthy();
        expect(preUser.email).toBeTruthy();
        expect(preUser.createdAt).toBeTruthy();
        expect(preUser.expiresIn).toBeTruthy();
        expect(preUser.name).toBeTruthy();
        expect(preUser.password_hash).toBeTruthy();
    })
})