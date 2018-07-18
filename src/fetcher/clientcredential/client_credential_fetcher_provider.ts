import {Request} from "../../models/request";
import {ClientCredentialFetcher} from "./client_credential_fetcher";

export class ClientCredentialFetcherProvider {

  private _fetchers: ClientCredentialFetcher[]

  public getfetcher(request: Request): ClientCredentialFetcher | undefined {
    return this._fetchers.find((fetcher: ClientCredentialFetcher): boolean => {
      return fetcher.match(request)
    })
  }

  get fetchers(): ClientCredentialFetcher[] {
    return this._fetchers;
  }

  set fetchers(value: ClientCredentialFetcher[]) {
    this._fetchers = value;
  }

}
