

export default class ErrorEmailValidationEntityCreation extends Error {
    constructor(message: string) {
        super(`Could not create Emailvalidation: ${message}`);
    }
}