export default class NotFoundCustomError extends Error {
  constructor(message: string) {
    super(`Not found error: ${message}`);
  }
}
