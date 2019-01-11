import {AccessTokenFetcher} from "./access_token_fetcher";
import {Request} from "../../models/request";

/**
 * This class provides [[AccessTokenFetcher]] implementation classes supported.
 *
 * For instance, the request is passed, then this class checks whether
 * a fetcher class which can fetch an access token from the request exists or
 * not with a [[match]] method of each implementation class.
 *
 * @author Yoichiro Tanaka
 */
export class AccessTokenFetcherProvider {

  private _fetchers: AccessTokenFetcher[]

  /**
	 * Find a fetcher instance which can fetch an access token from the request
	 * passed as an argument value and return it. The [[match]] method of each
	 * implementation class is used to confirm whether the access token can be
	 * fetched or not.
	 *
	 * @param request The request object.
	 * @return The fetcher instance which can fetch an access token from
	 * the request. If not found, return null.
	 */
  public getfetcher(request: Request): AccessTokenFetcher | undefined {
    return this._fetchers.find((fetcher: AccessTokenFetcher): boolean => {
      return fetcher.match(request)
    })
  }

  /**
	 * Retrieve the supported [[AccessTokenFetcher]] instances.
	 * @return The fetcher instances.
	 */
  get fetchers(): AccessTokenFetcher[] {
    return this._fetchers;
  }

  /**
	 * Set [[AccessTokenFetcher]] implementation instances you support.
	 * @param fetchers The implementation instance of the [[AccessTokenFetcher]]
	 * class.
	 */
  set fetchers(value: AccessTokenFetcher[]) {
    this._fetchers = value;
  }

}
