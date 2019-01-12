import {ClientCredentialFetcher} from "../client_credential_fetcher";
import {Request, ClientCredential} from "../../../models";

/**
 * This class fetches a client credential from Authorization Request header.
 * Actually, the client credential is clipped from the header string with a regular
 * expression.
 *
 * @author Yoichiro Tanaka
 */
export class AuthHeaderClientCredentialFetcher implements ClientCredentialFetcher {

  private readonly REGEXP_BASIC = /^\s*(Basic)\s+(.*)$/

  /**
	 * Return whether a client credential is included in the Authorization
	 * request header.
	 *
	 * @param request The request object.
	 * @return If the header value has a client credential, this result is true.
	 */
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

   /**
	 * Fetch a client credential from an Authorization request header and return it.
	 * This method must be called when a result of the [[match]] method is true
	 * only.
	 *
	 * @param request The request object.
	 * @return the fetched client credential.
	 */
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
