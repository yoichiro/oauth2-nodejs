import {ClientCredentialFetcherProvider} from "../client_credential_fetcher_provider";
import {AuthHeaderClientCredentialFetcher} from "./auth_header_client_credential_fetcher";
import {RequestParameterClientCredentialFetcher} from "./request_parameter_client_credential_fetcher";

/**
 * This class is the implementation class of the [[ClientCredentialFetcher]].
 * This implementation provides two instances to fetch a client credential from
 * "AuthHeader" and "RequestParameter".
 *
 * @author Yoichiro Tanaka
 */
export class DefaultClientCredentialFetcherProvider extends ClientCredentialFetcherProvider {

  /**
	 * This constructor creates instances of [[AuthHeaderClientCredentialFetcher]] and
   * [[RequestParameterClientCredentialFetcher]] implementation classes.
	 */
  constructor() {
    super()
    this.fetchers = [
      new AuthHeaderClientCredentialFetcher(),
      new RequestParameterClientCredentialFetcher()
    ]
  }

}
