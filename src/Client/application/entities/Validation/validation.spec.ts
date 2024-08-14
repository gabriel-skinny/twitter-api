import { VALIDATION_CODE_EXPIRATION_IN_HOURS } from "src/Client/application/constants/validationCode";
import ErrorEmailValidationEntityCreation from "../../errors/emailValidationEntityCreation";
import { OperationToValidateTypeEnum, Validation } from "./Validation";
import { ValidationCode } from "./ValidationCode";


describe("Email validation entity test", () => {
    it ("should create a EmailValidation entity", () => {
        const validation = new Validation({
            email: "teste@gmail.com",
            validationCode: new ValidationCode(123456),
            operationToValidateType: OperationToValidateTypeEnum.EMAIL_CONFIRMATION
        });

        expect(validation).toBeTruthy();
    })

    it ("should create a EmailValidation with validationCode as a random number with 6 length", () => {
        const emailValidation = new Validation({
            email: "teste@gmail.com",
            validationCode: new ValidationCode(123456),
            operationToValidateType: OperationToValidateTypeEnum.EMAIL_CONFIRMATION,
        });

        expect(String(emailValidation.validationCode)).toHaveLength(6);
        expect(emailValidation.validationCode).not.toBeNaN();
    })

    it ("should throw a EmailValidationError if expirationInHourse is differente than 2", () => {
        const errorMessage = `ExpirationInHours has to be ${VALIDATION_CODE_EXPIRATION_IN_HOURS}`

        expect(async () => new Validation({
            email: "teste@gmail.com",
            validationCode: new ValidationCode(123456),
            operationToValidateType: OperationToValidateTypeEnum.EMAIL_CONFIRMATION,
            expirationIn: 3,
        })).rejects.toStrictEqual(new ErrorEmailValidationEntityCreation(errorMessage))
    })
})