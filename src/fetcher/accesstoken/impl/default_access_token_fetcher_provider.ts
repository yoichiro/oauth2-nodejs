import {AccessTokenFetcherProvider} from "../access_token_fetcher_provider";
import {AuthHeaderAccessTokenFetcher} from "./auth_header_access_token_fetcher";
import {RequestParameterAccessTokenFetcher} from "./request_parameter_access_token_fetcher";

export class DefaultAccessTokenFetcherProvider extends AccessTokenFetcherProvider {

  constructor() {
    super()
    this.fetchers = [
      new AuthHeaderAccessTokenFetcher(),
      new RequestParameterAccessTokenFetcher()
    ]
  }

}
