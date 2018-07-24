import {GrantHandler, GrantHandlerResult} from "../grant_handler";
import {DataHandler} from "../../data/data_handler";
import {AuthInfo} from "../../models/auth_info";
import {InvalidRequest} from "../../exceptions/oauth_error";
import {Request} from "../../models/request";
import {ClientCredentialFetcherProvider} from "../../fetcher/clientcredential/client_credential_fetcher_provider";
import {ClientCredential} from "../../models/client_credential";
import {Result} from "../../utils/result";

export abstract class AbstractGrantHandler implements GrantHandler {

  private _clientCredentialFetcherProvider: ClientCredentialFetcherProvider;

  public set clientCredentialFetcherProvider(clientCredentialFetcherProvider: ClientCredentialFetcherProvider) {
    this._clientCredentialFetcherProvider = clientCredentialFetcherProvider
  }

  public getClientCredential(request: Request): Result<ClientCredential> {
    const fetcher = this._clientCredentialFetcherProvider.getfetcher(request)
    if (fetcher) {
      return Result.success<ClientCredential>(fetcher.fetch(request))
    } else {
      return Result.error<ClientCredential>(new InvalidRequest("Client credential not found"))
    }
  }

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

  protected getParameter(request: Request, name: string): Result<string> {
    const value = request.getParameter(name)
    if (!value || value.length === 0) {
      return Result.error<string>(new InvalidRequest(`'${name}' not found`))
    }
    return Result.success<string>(value)
  }

  public abstract async handleRequest(dataHandler: DataHandler): Promise<Result<GrantHandlerResult>>

}
