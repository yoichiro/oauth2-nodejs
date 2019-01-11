import {AccessTokenFetcherProvider} from "../access_token_fetcher_provider";
import {AuthHeaderAccessTokenFetcher} from "./auth_header_access_token_fetcher";
import {RequestParameterAccessTokenFetcher} from "./request_parameter_access_token_fetcher";

/**
 * This class is the implementation class of the [[AccessTokenFetcherProvider]].
 * This implementation provides two instances to fetch an access token from
 * "AuthHeader" and "RequestParameter".
 *
 * @author Yoichiro Tanaka
 */
export class DefaultAccessTokenFetcherProvider extends AccessTokenFetcherProvider {

  /**
	 * This constructor creates instances of [[AuthHeaderAccessTokenFetcher]] and
   * [[RequestParameterAccessTokenFetcher]] implementation classes.
	 */
  constructor() {
    super()
    this.fetchers = [
      new AuthHeaderAccessTokenFetcher(),
      new RequestParameterAccessTokenFetcher()
    ]
  }

}
