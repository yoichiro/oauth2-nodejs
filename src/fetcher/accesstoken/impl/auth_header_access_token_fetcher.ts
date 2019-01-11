import {AccessTokenFetcher, FetchResult} from "../access_token_fetcher";
import {Request} from "../../../models/request";

/**
 * This class fetches an access token from Authorization Request header.
 * Actually, the access token is clipped from the header string with a regular
 * expression.
 *
 * @author Yoichiro Tanaka
 */
export class AuthHeaderAccessTokenFetcher implements AccessTokenFetcher {

  private readonly HEADER_AUTHORIZATION: string = "Authorization"
  private readonly REGEXP_AUTHORIZATION: RegExp = /^\s*(OAuth|Bearer)\s+([^\s\,]*)/
  private readonly REGEXP_TRIM: RegExp = /^\s*,\s*/
  private readonly REGEXP_DIV_COMMA: RegExp = /,\s*/
  private readonly REGEXP_HEADER: RegExp = /^\s*(OAuth|Bearer)(.*)$/

  /**
	 * Return whether an access token is included in the Authorization
	 * request header.
	 *
	 * @param request The request object.
	 * @return If the header value has an access token, this result is true.
	 */
  match(request: Request): boolean {
    const header = request.getHeader(this.HEADER_AUTHORIZATION)
    if (header) {
      return this.REGEXP_HEADER.test(header)
    }
    return false
  }

  /**
	 * Fetch an access token from an Authorization request header and return it.
	 * This method must be called when a result of the [[match]] method is true
	 * only.
	 *
	 * @param request The request object.
	 * @return the fetched access token.
	 */
  fetch(request: Request): FetchResult {
    const header = request.getHeader(this.HEADER_AUTHORIZATION)
    if (!header) {
      throw new Error("fetch() method was called when match() result was false.")
    }
    let matcher = this.REGEXP_AUTHORIZATION.exec(header)
    if (!matcher) {
      throw new Error("fetch() method was called when match() result was false.")
    }
    const token: string = matcher[2]
    const params = new Map<string, string>()
    if (header.length !== matcher[0].length) {
      let paramsPart = header.substring(matcher[0].length)
      matcher = this.REGEXP_TRIM.exec(paramsPart)
      if (matcher) {
        paramsPart = paramsPart.substring(matcher[0].length)
      } else {
        throw new Error("Invalid format: " + header)
      }
      const list = paramsPart.split(this.REGEXP_DIV_COMMA)
      list.forEach(param => {
        const pair = param.split("=", 2)
        const key = pair[0]
        let value = pair[1]
        value = value.replace(/^"/, "")
        value = value.replace(/"$/, "")
        params.set(key, value)
      })
    }
    return new FetchResult(token, params)
  }

}
