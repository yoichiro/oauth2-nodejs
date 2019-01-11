import {GrantHandlerProvider} from "../grant_handler_provider";
import {ClientCredentialFetcherProvider} from "../../fetcher/clientcredential/client_credential_fetcher_provider";
import {GrantHandler} from "../grant_handler";
import {AuthorizationCodeGrantHandler} from "./authorization_code_grant_handler";
import {RefreshTokenGrantHandler} from "./refresh_token_grant_handler";
import {ClientCredentialsGrantHandler} from "./client_credentials_grant_handler";
import {PasswordGrantHandler} from "./password_grant_handler";

/**
 * This class is a default implementation for the [[GrantHandlerProvider]] interface.
 * All grant types are supported in this class. If you don't support all types,
 * you should not use this implementation, then you should provide your
 * implementation to support only types you want to use.
 *
 * @author Yoichiro Tanaka
 */
export class DefaultGrantHandlerProvider extends GrantHandlerProvider {

  /**
	 * Initialize this instance. All grant handlers are set.
	 */
  constructor(clientCredentialFetcherProvider: ClientCredentialFetcherProvider) {
    super()

    const handlers = new Map<string, GrantHandler>()

    const authorizationCode = new AuthorizationCodeGrantHandler()
    authorizationCode.clientCredentialFetcherProvider = clientCredentialFetcherProvider
    handlers.set("authorization_code", authorizationCode)

    const refreshToken = new RefreshTokenGrantHandler()
    refreshToken.clientCredentialFetcherProvider = clientCredentialFetcherProvider
    handlers.set("refresh_token", refreshToken)

    const clientCredentials = new ClientCredentialsGrantHandler()
    clientCredentials.clientCredentialFetcherProvider = clientCredentialFetcherProvider
    handlers.set("client_credentials", clientCredentials)

    const password = new PasswordGrantHandler()
    password.clientCredentialFetcherProvider = clientCredentialFetcherProvider
    handlers.set("password", password)

    this.handlers = handlers
  }

}
