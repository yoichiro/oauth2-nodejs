import {ClientCredentialFetcher} from "../client_credential_fetcher";
import {Request} from "../../../models/request";
import {ClientCredential} from "../../../models/client_credential";

export class RequestParameterClientCredentialFetcher implements ClientCredentialFetcher {

  match(request: Request): boolean {
    const clientId = request.getParameter("client_id")
    const clientSecret = request.getParameter("client_secret")
    if (clientId && clientSecret) {
      return clientId.length > 0 && clientSecret.length > 0
    }
    return false
  }

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