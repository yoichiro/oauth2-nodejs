import {ClientCredentialFetcher} from "../client_credential_fetcher";
import {Request, ClientCredential} from "../../../models";

export class AuthHeaderClientCredentialFetcher implements ClientCredentialFetcher {

  private readonly REGEXP_BASIC = /^\s*(Basic)\s+(.*)$/

  match(request: Request): boolean {
    const header = request.getHeader("Authorization")
    if (header) {
      const matcher = this.REGEXP_BASIC.exec(header)
      if (matcher) {
        const decoded = Buffer.from(matcher[2], "base64").toString("ascii")
        return decoded.indexOf(":") > 0
      }
    }
    return false
  }

  fetch(request: Request): ClientCredential {
    const header = request.getHeader("Authorization")
    if (!header) {
      throw new Error("fetch() method was called when match() result was false.")
    }
    const matcher = this.REGEXP_BASIC.exec(header)
    if (!matcher) {
      throw new Error("fetch() method was called when match() result was false.")
    }
    const decoded = Buffer.from(matcher[2], "base64").toString("ascii")
    if (decoded.indexOf(":") > 0) {
      const credential = decoded.split(":", 2)
      return new ClientCredential(credential[0], credential[1])
    } else {
      throw new Error("Invalid client credential: " + header)
    }
  }

}
