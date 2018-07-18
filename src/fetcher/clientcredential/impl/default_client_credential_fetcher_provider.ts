import {ClientCredentialFetcherProvider} from "../client_credential_fetcher_provider";
import {AuthHeaderClientCredentialFetcher} from "./auth_header_client_credential_fetcher";
import {RequestParameterClientCredentialFetcher} from "./request_parameter_client_credential_fetcher";

export class DefaultClientCredentialFetcherProvider extends ClientCredentialFetcherProvider {

  constructor() {
    super()
    this.fetchers = [
      new AuthHeaderClientCredentialFetcher(),
      new RequestParameterClientCredentialFetcher()
    ]
  }

}
