export class AuthInfo {

  private _id: string
  private _userId: string
  private _clientId: string
  private _scope: string
  private _refreshToken: string
  private _code: string
  private _redirectUri: string

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  get clientId(): string {
    return this._clientId;
  }

  set clientId(value: string) {
    this._clientId = value;
  }

  get scope(): string {
    return this._scope;
  }

  set scope(value: string) {
    this._scope = value;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }

  set refreshToken(value: string) {
    this._refreshToken = value;
  }

  get code(): string {
    return this._code;
  }

  set code(value: string) {
    this._code = value;
  }

  get redirectUri(): string {
    return this._redirectUri;
  }

  set redirectUri(value: string) {
    this._redirectUri = value;
  }

}
