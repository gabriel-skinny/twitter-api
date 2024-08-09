import { ValidationCode } from "./ValidationCode"

describe("ValidationCode entity", () => {
            const errorMessage = `Error on ValidationCode entity creation`
    
    it ("should create a ValidationCode", () => {
        const validationCode = new ValidationCode();

        expect(validationCode).toBeTruthy();
        expect(validationCode.value).not.toBeNaN();
    })

    it ("should throw a error if validationCode length is differente than 6", () => {
        expect(async () => new ValidationCode(131))
        .rejects.toStrictEqual(new Error(errorMessage))
    })

    it ("should throw a error if validationCode is not a number", () => {
        expect(async () => new ValidationCode("1231" as any))
        .rejects.toStrictEqual(new Error(errorMessage))
    })
})