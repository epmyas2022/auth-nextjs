export default class InvalidStateException extends Error {
  constructor(message?: string) {
    super(message || "Invalid OAuth state provided.");
    this.name = "InvalidStateException";
  }
}
