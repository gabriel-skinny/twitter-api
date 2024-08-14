export default class ErrorUserNotFound extends Error {
    constructor() {
        super(`User not found`);
    }
}