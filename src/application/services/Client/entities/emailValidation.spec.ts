import { VALIDATION_CODE_EXPIRATION_IN_HOURS } from "@constants/validationCode";
import ErrorEmailValidationEntityCreation from "../errors/emailValidationEntityCreation";
import { EmailValidation } from "./EmailValidation";
import { ValidationCode } from "./ValidationCode";

describe("Email validation entity test", () => {
    it ("should create a EmailValidation entity", () => {
        const emailValidation = new EmailValidation({
            userId: "teste",
            validationCode: new ValidationCode()
        });

        expect(emailValidation).toBeTruthy();
    })

    it ("should create a EmailValidation with validationCode as a random number with 6 length", () => {
        const emailValidation = new EmailValidation({
            userId: "teste",
            validationCode: new ValidationCode()
        });

        expect(String(emailValidation.validationCode)).toHaveLength(6);
        expect(emailValidation.validationCode).not.toBeNaN();
    })

    it ("should throw a EmailValidationError if expirationInHourse is differente than 2", () => {
        const errorMessage = `ExpirationInHours has to be ${VALIDATION_CODE_EXPIRATION_IN_HOURS}`

        expect(async () => new EmailValidation({
            userId: "teste",
            expirationInHours: 3,
            validationCode: new ValidationCode()
        })).rejects.toStrictEqual(new ErrorEmailValidationEntityCreation(errorMessage))
    })
})