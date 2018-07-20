import {OAuthError} from "../exceptions";

export class Result<T> {

  private _value: T | undefined
  private _error: OAuthError | undefined

  constructor(value?: T, error?: OAuthError) {
    this._value = value
    this._error = error
  }

  public get value(): T {
    if (this._value) {
      return this._value
    } else {
      throw new Error("The value not set")
    }
  }

  public get error(): OAuthError {
    if (this._error) {
      return this._error
    } else {
      throw new Error("The error not set")
    }
  }

  public isSuccess(): boolean {
    return this._error === undefined
  }

  public isError(): boolean {
    return this._error !== undefined
  }

  public convertError<X>(): Result<X> {
    if (this._error) {
      return Result.error<X>(this._error)
    } else {
      throw new Error("convertError() called against the success result")
    }
  }

  public static success<T>(value?: T): Result<T> {
    if (value) {
      return new Result<T>(value)
    } else {
      return new Result<T>()
    }
  }

  public static error<T>(error: OAuthError): Result<T> {
    return new Result<T>(undefined, error)
  }

}
