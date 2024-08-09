

export default class ErrorLoginAttempEntityCreation extends Error {
    constructor(message: string) {
        super(`Could not create LoginAttemp: ${message}`);
    }
}