import {AccessTokenFetcher, FetchResult} from "../access_token_fetcher";
import {Request} from "../../../models/request";

/**
 * This class fetches an access token from request parameters.
 * Actually, the access token is picked up from an "oauth_token" or "access_token"
 * parameter's value.
 *
 * @author Yoichiro Tanaka
 */
export class RequestParameterAccessTokenFetcher implements AccessTokenFetcher {

  /**
	 * Return whether an access token is included in the request parameter's
	 * values. Actually, this method confirms whether the "oauth_token" or
	 * "access_token" request parameter exists or not.
	 *
	 * @param request The request object.
	 * @return If either parameter exists, this result is true.
	 */
  match(request: Request): boolean {
    const oauthToken = request.getParameter("oauth_token")
    if (oauthToken) {
      return oauthToken.length > 0
    }
    const accessToken = request.getParameter("access_token")
    if (accessToken) {
      return accessToken.length > 0
    }
    return false
  }

  /**
	 * Fetch an access token from a request parameter and return it.
	 * This method must be called when a result of the [[match]] method is true
	 * only.
	 *
	 * @param request The request object.
	 * @return the fetched access token.
	 */
  fetch(request: Request): FetchResult {
    const params = new Map<string, string>()
    let token = undefined
    request.getParameterMap().forEach((value, key) => {
      if (key === "oauth_token" || key === "access_token") {
        token = value
      } else {
        params.set(key, value)
      }
    })
    if (!token) {
      throw new Error("fetch() method was called when match() result was false.")
    }
    return new FetchResult(token, params)
  }

}
