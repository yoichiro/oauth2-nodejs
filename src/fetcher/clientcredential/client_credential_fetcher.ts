import {Request} from "../../models/request";
import {ClientCredential} from "../../models/client_credential";

/**
 * This interface defines a method to fetch a client credential information
 * from a request.
 *
 * @author Yoichiro Tanaka
 */
export interface ClientCredentialFetcher {

  /**
	 * Judge whether a request has a client credential or not.
	 * @param request The request object.
	 * @return If the request has a client credential, return true.
	 */
  match(request: Request): boolean

  /**
	 * Fetch a client credential from a request passed as the argument and
	 * return it.
	 * @param request The request object.
	 * @return The fetched client credential information.
	 */
  fetch(request: Request): ClientCredential;

}
