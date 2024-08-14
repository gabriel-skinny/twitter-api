import { makePreUser } from "../../tests/factories/makePreUser";
import { Password } from "./Password";

describe("PreUser entity test", () => {
    it ("should create a PreUser", () => {
        const preUser =  makePreUser();
        
        expect(preUser).toBeTruthy();
    })

    it ("should have all values", () => {        
        const preUser = makePreUser();
        
        expect(preUser.id).toBeTruthy();
        expect(preUser.email).toBeTruthy();
        expect(preUser.createdAt).toBeTruthy();
        expect(preUser.expiresIn).toBeTruthy();
        expect(preUser.name).toBeTruthy();
        expect(preUser.password_hash).toBeTruthy();
    })
})