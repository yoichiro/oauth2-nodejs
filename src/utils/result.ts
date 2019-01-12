import {OAuthError} from "../exceptions";

/**
 * This class provides an ability to hold typed result information.
 *
 * @author Yoichiro Tanaka
 */
export class Result<T> {

  private _value: T | undefined
  private _error: OAuthError | undefined

  /**
   * Initialize this instance with arguments.
   * @param value The value in case of successful.
   * @param error The OAuthError value in case if failure.
   */
  constructor(value?: T, error?: OAuthError) {
    this._value = value
    this._error = error
  }

  /**
   * Retireve the value.
   * @return The value.
   * @throws Error If the value is undefined.
   */
  public get value(): T {
    if (this._value) {
      return this._value
    } else {
      throw new Error("The value not set")
    }
  }

  /**
   * Retrieve the error.
   * @return The OAuthError object.
   * @throws Error If the error is undefined.
   */
  public get error(): OAuthError {
    if (this._error) {
      return this._error
    } else {
      throw new Error("The error not set")
    }
  }

  /**
   * Retrieve whether the value is set or not.
   * @return If the value is set, return true. Otherwise, return false.
   */
  public isSuccess(): boolean {
    return this._error === undefined
  }

  /**
   * Retrieve whether the error is set or not.
   * @return If the error is set, return true. Otherwise, return false.
   */
  public isError(): boolean {
    return this._error !== undefined
  }

  /**
   * Convert this instance with error value.
   *
   * This method returns a new instance that has same error value. But, the new
   * instance is parameterized with specified new type.
   *
   * @return The new instance.
   * @throws Error If this instance has the value, not the error.
   */
  public convertError<X>(): Result<X> {
    if (this._error) {
      return Result.error<X>(this._error)
    } else {
      throw new Error("convertError() called against the success result")
    }
  }

  /**
   * Create a new instance for successful with the value.
   * @param value The value.
   * @return The new instance.
   */
  public static success<T>(value?: T): Result<T> {
    if (value) {
      return new Result<T>(value)
    } else {
      return new Result<T>()
    }
  }

  /**
   * Create a new instance for error with the OAuthError object.
   * @param error The OAuthError object.
   * @returns The new instance.
   */
  public static error<T>(error: OAuthError): Result<T> {
    return new Result<T>(undefined, error)
  }

}
