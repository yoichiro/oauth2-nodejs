import {AccessTokenFetcher} from "./access_token_fetcher";
import {Request} from "../../models/request";

export class AccessTokenFetcherProvider {

  private _fetchers: AccessTokenFetcher[]

  public getfetcher(request: Request): AccessTokenFetcher | undefined {
    return this._fetchers.find((fetcher: AccessTokenFetcher): boolean => {
      return fetcher.match(request)
    })
  }

  get fetchers(): AccessTokenFetcher[] {
    return this._fetchers;
  }

  set fetchers(value: AccessTokenFetcher[]) {
    this._fetchers = value;
  }

}
