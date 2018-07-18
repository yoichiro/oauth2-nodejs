export class AccessToken {

  private _authId: string
  private _token: string
  private _expiresIn: number
  private _createdOn: number

  get authId(): string {
    return this._authId;
  }

  set authId(value: string) {
    this._authId = value;
  }

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }

  get expiresIn(): number {
    return this._expiresIn;
  }

  set expiresIn(value: number) {
    this._expiresIn = value;
  }

  get createdOn(): number {
    return this._createdOn;
  }

  set createdOn(value: number) {
    this._createdOn = value;
  }

}
