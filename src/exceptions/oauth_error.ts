/**
 * This abstract class represents an OAuth error information.
 * Actually, each error should be represented by creating this sub class.
 *
 * @author Yoichiro Tanaka
 */
export abstract class OAuthError {

  private _code: number
  private _description: string

  	/**
	 * Initialize this instance by two argument values.
	 * @param code The HTTP status code which should be returned to the client.
	 * @param description The human-readable string which describes the detail
	 * information regarding the error.
	 */
  constructor(code: number, description: string) {
    this._code = code
    this._description = description
  }

  /**
	 * Retrieve the HTTP status code value.
	 * @return The HTTP status code.
	 */
  public get code(): number {
    return this._code
  }

  /**
	 * Retrieve the error description.
	 * The human-readable string which describes the detail information
	 * regarding the error. This string is returned as the error_description
	 * property value.
	 * @return The description string.
	 */
  public get description(): string {
    return this._description
  }

  /**
	 * Retrieve the error type.
	 * This sub class must implement this method. This result is returned
	 * as the error property value.
	 * @return The error type string.
	 */
  public abstract getType(): string

  /**
   * Create the JSON string represents this object.
   *
   * @return The JSON string which has each information this object has.
   */
  public toJson(): string {
    const obj: {[key: string]: string} = {
      "error": this.getType()
    }
    if (this.description && this.description.length > 0) {
      obj["error_description"] = this.description
    }
    return JSON.stringify(obj)
  }

}

/**
 * This exception represents that the request is invalid.
 * For instance, this error type is "invalid_request".
 *
 * @author Yoichiro Tanaka
 *
 */
export class InvalidRequest extends OAuthError {

  /**
   * Initialize this instance. The HTTP status code is set as 400.
   * @param description The error description string.
   */
  constructor(description: string) {
    super(400, description)
  }

  /**
   * Retrieve the error type string.
   * This method returns the fixed string "invalid_request".
   */
  public getType(): string {
    return "invalid_request"
  }

}

/**
 * This exception represents that the client is invalid.
 * For instance, this error type is "invalid_client".
 *
 * @author Yoichiro Tanaka
 */
export class InvalidClient extends OAuthError {

  /**
   * Initialize this instance. The HTTP status code is set as 401.
   * @param description The error description string.
   */
  constructor(description: string) {
    super(401, description)
  }

  /**
   * Retrieve the error type string.
   * This method returns the fixed string "invalid_client".
   */
  public getType(): string {
    return "invalid_client"
  }

}

/**
	 * This means that the client is not authorized to request an authorization
	 * code using this method. For instance, this error type is
	 * "unauthorized_client".
	 *
	 * @author Yoichiro Tanaka
	 */
export class UnauthorizedClient extends OAuthError {

  /**
   * Initialize this instance. The HTTP status code is set as 401.
   * @param description The error description string.
   */
  constructor(description: string) {
    super(401, description)
  }

  /**
   * Retrieve the error type string.
   * This method returns the fixed string "unauthorized_client".
   */
  public getType(): string {
    return "unauthorized_client"
  }

}

/**
	 * This means that the redirect_uri value does not match the value set in
	 * advance. For instance, this error type is "redirect_uri_mismatch".
	 *
	 * @author Yoichiro Tanaka
	 */
export class RedirectUriMismatch extends OAuthError {

  /**
   * Initialize this instance. The HTTP status code is set as 401.
   * @param description The error description string.
   */
  constructor(description: string) {
    super(401, description)
  }

  /**
   * Retrieve the error type string.
   * This method returns the fixed string "redirect_uri_mismatch".
   */
  public getType(): string {
    return "redirect_uri_mismatch"
  }

}

/**
	 * This means that the result is denied. For instance, this error type is
	 * "access_denied".
	 *
	 * @author Yoichiro Tanaka
	 */
export class AccessDenied extends OAuthError {

  /**
   * Initialize this instance. The HTTP status code is set as 401.
   * @param description The error description string.
   */
  constructor(description: string) {
    super(401, description)
  }

  /**
   * Retrieve the error type string.
   * This method returns the fixed string "access_denied".
   */
  public getType(): string {
    return "access_denied"
  }

}

/**
 * This means that the authorization server does not support obtaining an
 * authorization code using this method. For instance, this error type is
 * "unsupported_response_type".
 *
 * @author Yoichiro Tanaka
 */
export class UnsupportedResponseType extends OAuthError {

  /**
   * Initialize this instance. The HTTP status code is set as 400.
   * @param description The error description string.
   */
  constructor(description: string) {
    super(400, description)
  }

  /**
   * Retrieve the error type string.
   * This method returns the fixed string "unsupported_response_type".
   */
  public getType(): string {
    return "unsupported_response_type"
  }

}

/**
 * This means that the provided authorization grant (e.g., authorization
 * code, resource owner credentials) or refresh token is
 * invalid, expired, revoked, does not match the redirection
 * URI used in the authorization request, or was issued to
 * another client. For instance, this error type is
 * "invalid_grant".
 *
 * @author yoichiro
 */
export class InvalidGrant extends OAuthError {

  /**
   * Initialize this instance. The HTTP status code is set as 401.
   * @param description The error description string.
   */
  constructor(description: string) {
    super(401, description)
  }

  /**
   * Retrieve the error type string.
   * This method returns the fixed string "invalid_grant".
   */
  public getType(): string {
    return "invalid_grant"
  }

}

/**
 * This means that the authorization grant type is not supported by the
 * authorization server. For instance, this error type is
 * "unsupported_grant_type".
 *
 * @author Yoichiro Tanaka
 */
export class UnsupportedGrantType extends OAuthError {

  /**
   * Initialize this instance. The HTTP status code is set as 400.
   * @param description The error description string.
   */
  constructor(description: string) {
    super(400, description)
  }

  /**
   * Retrieve the error type string.
   * This method returns the fixed string "unsupported_grant_type".
   */
  public getType(): string {
    return "unsupported_grant_type"
  }

}

/**
 * This means that the requested scope is invalid, unknown, malformed, or
 * exceeds the scope granted by the resource owner. For instance, this
 * error type is "invalid_scope".
 *
 * @author Yoichiro Tanaka
 */
export class InvalidScope extends OAuthError {

  /**
   * Initialize this instance. The HTTP status code is set as 401.
   * @param description The error description string.
   */
  constructor(description: string) {
    super(401, description)
  }

  /**
   * Retrieve the error type string.
   * This method returns the fixed string "invalid_scope".
   */
  public getType(): string {
    return "invalid_scope"
  }

}

/**
 * This means that the access token passed to the API's endpoint is invalid.
 * For instance, this error type is "invalid_token".
 *
 * @author Yoichiro Tanaka
 */
export class InvalidToken extends OAuthError {

  /**
   * Initialize this instance. The HTTP status code is set as 401.
   * @param description The error description string.
   */
  constructor(description: string) {
    super(401, description)
  }

  /**
   * Retrieve the error type string.
   * This method returns the fixed string "invalid_token".
   */
  public getType(): string {
    return "invalid_token"
  }

}

/**
 * This means that the access token passed to the API's endpoint has
 * already been expired. For instance, this error type is "invalid_token".
 *
 * @author Yoichiro Tanaka
 */
export class ExpiredToken extends OAuthError {

  /**
   * Initialize this instance. The HTTP status code is set as 401.
   */
  constructor() {
    super(401, "The access token expired")
  }

  /**
   * Retrieve the error type string.
   * This method returns the fixed string "invalid_token".
   */
  public getType(): string {
    return "invalid_token"
  }

}

/**
 * This means that the specified scope is insufficient. For instance, this
 * error type is "insufficient_scope".
 *
 * @author Yoichiro Tanaka
 */
export class InsufficientScope extends OAuthError {

  /**
   * Initialize this instance. The HTTP status code is set as 401.
   * @param description The error description string.
   */
  constructor(description: string) {
    super(401, description)
  }

  /**
   * Retrieve the error type string.
   * This method returns the fixed string "insufficient_scope".
   */
  public getType(): string {
    return "insufficient_scope"
  }

}

/**
 * This means that the unexpected error occurred.
 *
 * @author Yoichiro Tanaka
 */
export class UnknownError extends OAuthError {

  /**
   * Initialize this instance with the description.
   * @param description The error description string.
   */
  constructor(description: string) {
    super(500, description)
  }

  /**
   * Retrieve the error type string.
   * This method returns the fixed string "unknown_error".
   */
  public getType(): string {
    return "unknown_error"
  }

}
