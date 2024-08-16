export default class NotFoundCustomError extends Error {
  constructor(dataName: string) {
    super(`Data not found: ${dataName}`);
  }
}
