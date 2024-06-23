export class ControllerError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.name = "ControllerError";
    this.code = code;
  }
}
