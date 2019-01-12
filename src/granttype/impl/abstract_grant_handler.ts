import {GrantHandler, GrantHandlerResult} from "../grant_handler";
import {DataHandler} from "../../data/data_handler";
import {AuthInfo} from "../../models/auth_info";
import {InvalidRequest} from "../../exceptions/oauth_error";
import {Request} from "../../models/request";
import {ClientCredentialFetcherProvider} from "../../fetcher/clientcredential/client_credential_fetcher_provider";
import {ClientCredential} from "../../models/client_credential";
import {Result} from "../../utils/result";

/**
 * This abstract class provides some common functions for this sub classes.
 *
 * @author Yoichiro Tanaka
 */
export abstract class AbstractGrantHandler implements GrantHandler {

  private _clientCredentialFetcherProvider: ClientCredentialFetcherProvider;

  /**
	 * Set the client credential fetcher instance.
	 * @param clientCredentialFetcher The fetcher object to fetch a client
	 * credential.
	 */
  public set clientCredentialFetcherProvider(clientCredentialFetcherProvider: ClientCredentialFetcherProvider) {
    this._clientCredentialFetcherProvider = clientCredentialFetcherProvider
  }

  /**
	 * Retrieve the client credential fetcher instance.
	 * @return The fetcher object to fetch a client credential.
	 */
  public getClientCredential(request: Request): Result<ClientCredential> {
    const fetcher = this._clientCredentialFetcherProvider.getfetcher(request)
    if (fetcher) {
      return Result.success<ClientCredential>(fetcher.fetch(request))
    } else {
      return Result.error<ClientCredential>(new InvalidRequest("Client credential not found"))
    }
  }

  /**
	 * Issue an access token and relating information and return it.
	 * Actually, issuing the access token is delegated to the specified data
	 * handler. If the issued result has a expires_in, refresh token and/or
	 * scope string, each parameter is included to the result of this method.
	 * @param dataHandler The data handler instance to access to your database
	 * and issue an access token.
	 * @param authInfo The authorization information created in advance.
	 * @return The result object which has an access token and etc.
	 */
  protected async issueAccessToken(dataHandler: DataHandler, authInfo: AuthInfo, grantType: string): Promise<GrantHandlerResult | undefined> {
    const accessToken = await dataHandler.createOrUpdateAccessToken(authInfo, grantType)
    if (!accessToken) {
      return undefined
    }
    const result = new GrantHandlerResult("Bearer", accessToken.token)
    if (accessToken.expiresIn > 0) {
      result.expiresIn = accessToken.expiresIn
    }
    if (grantType !== "client_credentials") {
      if (authInfo.refreshToken && authInfo.refreshToken.length > 0) {
        result.refreshToken = authInfo.refreshToken
      }
    }
    if (authInfo.scope && authInfo.scope.length > 0) {
      result.scope = authInfo.scope
    }
    return result
  }

  	/**
	 * Retrieve the parameter value against the parameter name.
	 *
	 * @param request The request object which has each parameters.
	 * @param name The parameter name which you want to retrieve.
	 * @return The parameter value. This never be null. If the parameter is not found or is
	 * empty string, return a response with InvalidRequest.
	 */
  protected getParameter(request: Request, name: string): Result<string> {
    const value = request.getParameter(name)
    if (!value || value.length === 0) {
      return Result.error<string>(new InvalidRequest(`'${name}' not found`))
    }
    return Result.success<string>(value)
  }

  /**
	 * Handle a request to issue a token and issue it.
	 * This method should be implemented for each grant type of OAuth2
	 * specification. For instance, the procedure uses a DataHandler instance
	 * to access to your database. Each grant type has some validation rule,
	 * if the validation is failed, this method will return a response with
   * the reason.
	 *
	 * @param dataHandler The DataHandler instance to access to your database.
	 * @return The issued token information as the result of calling this method.
	 */
  public abstract async handleRequest(dataHandler: DataHandler): Promise<Result<GrantHandlerResult>>

}
