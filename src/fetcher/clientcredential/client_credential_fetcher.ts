import {Request} from "../../models/request";
import {ClientCredential} from "../../models/client_credential";

export interface ClientCredentialFetcher {

  match(request: Request): boolean

  fetch(request: Request): ClientCredential;

}
