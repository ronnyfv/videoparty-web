import { Observable } from "rxjs";

export class Validator {
  get isValid() {
    return !this._errors.length;
  }

  get errors() {
    return this._erros;
  }

  get message() {
    return this._erros.join(', ');
  }

  constructor() {
    this._errors = [];
  }

  error(message) {
    this._errors.push(message);
  }

  toObject() {
    if (this.isValid)
      return {};

    return {
      erros: this.error,
      message: this.message
    };
  }

  throw$() {
    return Observable.throw({ clientMessage: this.message });
  }
}