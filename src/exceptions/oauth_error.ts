export abstract class OAuthError {

  private _code: number
  private _description: string

  constructor(code: number, description: string) {
    this._code = code
    this._description = description
  }

  public get code(): number {
    return this._code
  }

  public get description(): string {
    return this._description
  }

  public abstract getType(): string

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

export class InvalidRequest extends OAuthError {

  constructor(description: string) {
    super(400, description)
  }

  public getType(): string {
    return "invalid_request"
  }

}

export class InvalidClient extends OAuthError {

  constructor(description: string) {
    super(401, description)
  }

  public getType(): string {
    return "invalid_client"
  }

}

export class UnauthorizedClient extends OAuthError {

  constructor(description: string) {
    super(401, description)
  }

  public getType(): string {
    return "unauthorized_client"
  }

}

export class RedirectUriMismatch extends OAuthError {

  constructor(description: string) {
    super(401, description)
  }

  public getType(): string {
    return "redirect_uri_mismatch"
  }

}

export class AccessDenied extends OAuthError {

  constructor(description: string) {
    super(401, description)
  }

  public getType(): string {
    return "access_denied"
  }

}

export class UnsupportedResponseType extends OAuthError {

  constructor(description: string) {
    super(400, description)
  }

  public getType(): string {
    return "unsupported_response_type"
  }

}

export class InvalidGrant extends OAuthError {

  constructor(description: string) {
    super(401, description)
  }

  public getType(): string {
    return "invalid_grant"
  }

}

export class UnsupportedGrantType extends OAuthError {

  constructor(description: string) {
    super(400, description)
  }

  public getType(): string {
    return "unsupported_grant_type"
  }

}

export class InvalidScope extends OAuthError {

  constructor(description: string) {
    super(401, description)
  }

  public getType(): string {
    return "invalid_scope"
  }

}

export class InvalidToken extends OAuthError {

  constructor(description: string) {
    super(401, description)
  }

  public getType(): string {
    return "invalid_token"
  }

}

export class ExpiredToken extends OAuthError {

  constructor() {
    super(401, "The access token expired")
  }

  public getType(): string {
    return "invalid_token"
  }

}

export class InsufficientScope extends OAuthError {

  constructor(description: string) {
    super(401, description)
  }

  public getType(): string {
    return "insufficient_scope"
  }

}
