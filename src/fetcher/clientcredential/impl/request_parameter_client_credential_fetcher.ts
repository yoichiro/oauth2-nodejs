import {ClientCredentialFetcher} from "../client_credential_fetcher";
import {Request} from "../../../models/request";
import {ClientCredential} from "../../../models/client_credential";

/**
 * This class fetches a client credential from request parameters.
 * Actually, the client credential is picked up from an "client_id" and "client_secret"
 * parameter's value.
 *
 * @author Yoichiro Tanaka
 */
export class RequestParameterClientCredentialFetcher implements ClientCredentialFetcher {

   /**
	 * Return whether a client credential is included in the request parameter's
	 * values. Actually, this method confirms whether the "client_id" and
	 * "client_secret" request parameter exists or not.
	 *
	 * @param request The request object.
	 * @return If either parameter exists, this result is true.
	 */
  match(request: Request): boolean {
    const clientId = request.getParameter("client_id")
    const clientSecret = request.getParameter("client_secret")
    if (clientId && clientSecret) {
      return clientId.length > 0 && clientSecret.length > 0
    }
    return false
  }

  /**
	 * Fetch a client credential from a request parameter and return it.
	 * This method must be called when a result of the [[match]] method is true
	 * only.
	 *
	 * @param request The request object.
	 * @return the fetched client credential.
	 */
  fetch(request: Request): ClientCredential {
    const clientId = request.getParameter("client_id")
    if (!clientId) {
      throw new Error("fetch() method was called when match() result was false.")
    }
    const clientSecret = request.getParameter("client_secret")
    if (!clientSecret) {
      throw new Error("fetch() method was called when match() result was false.")
    }
    return new ClientCredential(clientId, clientSecret)
  }

}
