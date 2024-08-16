export default class AlreadyCreatedError extends Error {
  constructor(dataName: string) {
    super(`Data already created with that value: ${dataName}`);
  }
}
