import { Password } from "./Password";

describe("User entity test", () => {
    it ("should create a password_hash", () => {
        const passwordSent = "hashedValue"
        const password =  new Password(passwordSent)
        
        expect(password).toBeTruthy();
        expect(password.value).not.toBe(passwordSent);
    })

    it ("should not hash a password if it is already hashed", () => {
        const passwordHashed = new Password("password")
        const password =  new Password(passwordHashed.value)
        
        expect(password).toBeTruthy();
        expect(password.value).toBe(passwordHashed.value);
    })
})