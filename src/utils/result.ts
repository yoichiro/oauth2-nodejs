import {OAuthError} from "../exceptions/oauth_error";

export class Result<T> {

  private _value: T
  private _error: OAuthError

  constructor(value: T);
  constructor(error: OAuthError);
  constructor(v: T | OAuthError) {
    if (v instanceof OAuthError) {
      this._error = v
    } else {
      this._value = v
    }
  }

  public get value(): T {
    return this._value
  }

  public get error(): OAuthError {
    return this._error
  }

  public isSuccess(): boolean {
    return this._value !== undefined
  }

  public isError(): boolean {
    return this._error !== undefined
  }

  public convertError<X>(): Result<X> {
    return Result.error<X>(this._error)
  }

  public static success<T>(value: T): Result<T> {
    return new Result<T>(value)
  }

  public static error<T>(error: OAuthError): Result<T> {
    return new Result<T>(error)
  }

}
