import {DataHandler} from "../data/data_handler";
import {Result} from "../utils/result";

export interface GrantHandler {

  handleRequest(dataHandler: DataHandler): Promise<Result<GrantHandlerResult>>

}

export class GrantHandlerResult {

  private _tokenType: string
  private _accessToken: string
  private _expiresIn: number
  private _refreshToken: string
  private _scope: string

  constructor(tokenType: string, accessToken: string) {
    this._tokenType = tokenType;
    this._accessToken = accessToken;
  }

  get tokenType(): string {
    return this._tokenType;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get expiresIn(): number {
    return this._expiresIn;
  }

  set expiresIn(value: number) {
    this._expiresIn = value;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }

  set refreshToken(value: string) {
    this._refreshToken = value;
  }

  get scope(): string {
    return this._scope;
  }

  set scope(value: string) {
    this._scope = value;
  }

  public toJson(): string {
    return JSON.stringify({
      "token_type": this.tokenType,
      "access_token": this.accessToken,
      "expires_in": this.expiresIn,
      "refresh_token": this.refreshToken
    })
  }

}
