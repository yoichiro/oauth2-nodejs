import {Request} from "../../models/request";
import {ClientCredentialFetcher} from "./client_credential_fetcher";

/**
 * This class provides [[ClientCredentialFetcher]] implementation classes supported.
 *
 * For instance, the request is passed, then this class checks whether
 * a fetcher class which can fetch a client credential from the request exists or
 * not with a [[match]] method of each implementation class.
 *
 * @author Yoichiro Tanaka
 */
export class ClientCredentialFetcherProvider {

  private _fetchers: ClientCredentialFetcher[]

  /**
	 * Find a fetcher instance which can fetch a client credential from the request
	 * passed as an argument value and return it. The [[match]] method of each
	 * implementation class is used to confirm whether the client credential can be
	 * fetched or not.
	 *
	 * @param request The request object.
	 * @return The fetcher instance which can fetch a client credential from
	 * the request. If not found, return null.
	 */
  public getfetcher(request: Request): ClientCredentialFetcher | undefined {
    return this._fetchers.find((fetcher: ClientCredentialFetcher): boolean => {
      return fetcher.match(request)
    })
  }

  /**
	 * Retrieve the supported [[ClientCredentialFetcher]] instances.
	 * @return The fetcher instances.
	 */
  get fetchers(): ClientCredentialFetcher[] {
    return this._fetchers;
  }

   /**
	 * Set [[ClientCredentialFetcher]] implementation instances you support.
	 * @param fetchers The implementation instance of the [[ClientCredentialFetcher]]
	 * class.
	 */
  set fetchers(value: ClientCredentialFetcher[]) {
    this._fetchers = value;
  }

}
