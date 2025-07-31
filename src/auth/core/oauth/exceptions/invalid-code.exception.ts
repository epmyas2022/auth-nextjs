export default class InvalidCodeException extends Error {
  constructor(message?: string) {
    super(message || "Invalid OAuth code provided.");
    this.name = "InvalidCodeException";
  }
}
