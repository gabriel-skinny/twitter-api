
export default class ErrorUserAlreadyCreated extends Error {
    constructor(fieldName: string) {
        super(`User already created with that ${fieldName}`);
    }
}