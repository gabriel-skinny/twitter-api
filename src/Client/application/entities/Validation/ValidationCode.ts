import { VALIDATION_CODE_LENGTH } from "src/Client/application/constants/validationCode";
import { randomSixNumberLengthGenerator } from "src/Shared/helpers/randomNumberGenerator";

export class ValidationCode {
    private readonly _value: number;

    constructor(value?: number) {
        this._value = value || randomSixNumberLengthGenerator();

        if (Number.isNaN(value) || String(this._value).length !== VALIDATION_CODE_LENGTH) {
            throw new Error("Error on ValidationCode entity creation");
        }
    }

    public get value() {
        return this._value;
    }
}