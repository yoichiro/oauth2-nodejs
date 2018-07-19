import {AccessTokenFetcher, FetchResult} from "../access_token_fetcher";
import {Request} from "../../../models/request";

export class AuthHeaderAccessTokenFetcher implements AccessTokenFetcher {

  private readonly HEADER_AUTHORIZATION: string = "Authorization"
  private readonly REGEXP_AUTHORIZATION: RegExp = /^\s*(OAuth|Bearer)\s+([^\s\,]*)/
  private readonly REGEXP_TRIM: RegExp = /^\s*,\s*/
  private readonly REGEXP_DIV_COMMA: RegExp = /,\s*/
  private readonly REGEXP_HEADER: RegExp = /^\s*(OAuth|Bearer)(.*)$/

  match(request: Request): boolean {
    const header = request.getHeader(this.HEADER_AUTHORIZATION)
    if (header) {
      return this.REGEXP_HEADER.test(header)
    }
    return false
  }

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
