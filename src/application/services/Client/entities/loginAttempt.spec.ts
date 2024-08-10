import { EXPIRES_LOGIN_ATTEMPT_IN_MINUTES } from "@constants/loginAttempt";
import ErrorLoginAttempEntityCreation from "../errors/loginAttempEntityCreation";
import { LoginAttempt } from "./LoginAttempt";

describe("LoginAttempt entity test", () => {
    it ("should create a LoginAttempt entity", () => {
        const loginAttempt = new LoginAttempt({
            userEmail: "email@gmail.com"
        });

        expect(loginAttempt).toBeTruthy();
    })

    it (`should throw a EmailValidationError if expiresIn is different than ${EXPIRES_LOGIN_ATTEMPT_IN_MINUTES}`, () => {
        const errorMessage = `Expires in has to be equal to ${EXPIRES_LOGIN_ATTEMPT_IN_MINUTES}`

        expect(async () => new LoginAttempt({
            userEmail: "email@gmail",
            expiresInMinutes: 5
        })).rejects.toStrictEqual(new ErrorLoginAttempEntityCreation(errorMessage))
    })
})