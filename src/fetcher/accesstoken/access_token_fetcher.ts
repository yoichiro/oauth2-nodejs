import {Request} from "../../models/request";

export interface AccessTokenFetcher {

  match(request: Request): boolean

  fetch(request: Request): FetchResult

}

export class FetchResult {

  private _token: string
  private _params: Map<string, string>

  constructor(token: string, params: Map<string, string>) {
    this._token = token;
    this._params = params;
  }

  get token(): string {
    return this._token;
  }

  get params(): Map<string, string> {
    return this._params;
  }

}
