import { VALIDATION_CODE_EXPIRATION_IN_HOURS } from "src/constants/validationCode";
import ErrorEmailValidationEntityCreation from "../errors/emailValidationEntityCreation";
import CryptoServiceStub from "../util/cryptoServiceStub";
import { EmailValidation } from "./EmailValidation";
import { Password } from "./Password";
import User from "./User"

describe("Email validation entity test", () => {
    it ("should create a EmailValidation entity", () => {
        const emailValidation = new EmailValidation({
            userId: "teste"
        });

        expect(emailValidation).toBeTruthy();
    })

    it ("should create a EmailValidation with validationCode as a random number with 6 length", () => {
        const emailValidation = new EmailValidation({
            userId: "teste"
        });

        expect(String(emailValidation.validationCode)).toHaveLength(6);
        expect(emailValidation.validationCode).toBeInstanceOf(Number);
    })

    it ("should throw a EmailValidationError if validationCode length is differente than 6", () => {
        const errorMessage = `ExpirationInHours has to be ${VALIDATION_CODE_EXPIRATION_IN_HOURS}`

        expect(() => new EmailValidation({
            userId: "teste",
            validationCode: 1100000002311,
        })).rejects.toThrow(new ErrorEmailValidationEntityCreation(errorMessage))
    })
})