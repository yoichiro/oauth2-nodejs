import {Request} from "../../models/request";

/**
 * This interface defines how to fetch an access token from a request object.
 *
 * This [[match]] method has an ability to judge whether the request has an
 * access token or not. The actual fetching process is executed in the [[fetch]]
 * method. This [[fetch]] method must be called when a result of the [[match]]
 * method is true only.
 *
 * @author Yoichiro Tanaka
 */
export interface AccessTokenFetcher {

  /**
	 * Judge whether a request has an access token or not.
	 * @param request The request object.
	 * @return If the request has an access token, return true.
	 */
  match(request: Request): boolean

  /**
	 * Retrieve an access token from a request object.
	 * This method must be called when a result of the [[match]] method
	 * is true only.
	 * @param request The request object.
	 * @return The fetched access token.
	 */
  fetch(request: Request): FetchResult

}

/**
 * This is a holder class to has an access token with the AccessTokenFetcher
 * instance.
 *
 * @author Yoichiro Tanaka
 */
export class FetchResult {

  private _token: string
  private _params: Map<string, string>

  /**
   * This constructor initializes with the specified argument values.
   * @param token The access token string.
   * @param params Other parameters.
   */
  constructor(token: string, params: Map<string, string>) {
    this._token = token;
    this._params = params;
  }

  /**
   * Retrieve the access token.
   * @return The token string.
   */
  get token(): string {
    return this._token;
  }

  /**
   * Retrieve the other parameters.
   * @return The other parameter map object.
   */
  get params(): Map<string, string> {
    return this._params;
  }

}
