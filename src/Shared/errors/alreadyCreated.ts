export default class AlreadyCreatedError extends Error {
  constructor(message: string) {
    super(`Already created error: ${message}`);
  }
}
