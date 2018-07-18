import {AccessTokenFetcher, FetchResult} from "../access_token_fetcher";
import {Request} from "../../../models/request";

export class RequestParameterAccessTokenFetcher implements AccessTokenFetcher {

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
