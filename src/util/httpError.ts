import { IFormError } from "./mongooseValidator";

// TODO: replace IResponse Error
export default class HTTPRequestError extends Error {
  public success: boolean;
  public status: number;
  public errors: IFormError;

  constructor(status: number,name: string, msg: string, errors: IFormError) {
    super(msg);
    this.success = false;
    this.name = name;
    this.status = status;
    this.message = msg;
    this.errors = errors;

    Object.setPrototypeOf(this, HTTPRequestError.prototype);
  }

  getStack() {
    return this.stack;
  }

  toString() {
    return JSON.stringify({
      success: this.success,
      status: this.status,
      name: this.name,
      message: this.message,
      errors: this.errors
    });
  }
}
