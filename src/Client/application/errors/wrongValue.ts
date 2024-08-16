export default class WrongValueError extends Error {
  constructor(fieldName: string) {
    super(`Wrong value passed to field: ${fieldName}`);
  }
}
