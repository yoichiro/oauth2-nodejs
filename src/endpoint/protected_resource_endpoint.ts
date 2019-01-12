import {AccessTokenFetcherProvider} from "../fetcher/accesstoken/access_token_fetcher_provider";
import {DataHandlerFactory} from "../data/data_handler_factory";
import {Request} from "../models/request";
import {Result} from "../utils/result";
import {ExpiredToken, InvalidRequest, InvalidToken} from "../exceptions/oauth_error";

/**
 * This class has the information about an OAuth2.0 request.
 *
 * If a check of the request is passed by [[ProtectedResourceEndpoint]],
 * this instance will be created. Each endpoint of API supported by
 * [[ProtectedResourceEndpoint]] can know the user ID, the client ID and
 * the authorized scopes.
 *
 * @author Yoichiro Tanaka
 *
 */
export class ProtectedResourceEndpointResponse {

  private _userId: string
  private _clientId: string
  private _scope: string

  /**
   * This constructor initializes this instance.
   * @param remoteUser The remote user's ID.
   * @param clientId The client ID.
   * @param scope The scope string authorized by the remote user.
   */
  constructor(userId: string, clientId: string, scope: string) {
    this._userId = userId;
    this._clientId = clientId;
    this._scope = scope;
  }

  /**
   * Retrieve the remote user's ID.
   * @return The user ID.
   */
  get userId(): string {
    return this._userId;
  }

  /**
   * Retrieve the client ID.
   * @return The client ID.
   */
  get clientId(): string {
    return this._clientId;
  }

  /**
   * Retrieve the scope string.
   * @return The scope string authorized by the remote user.
   */
  get scope(): string {
    return this._scope;
  }

}

/**
 * This class provides the function to judge whether an access to protected
 * resources can be applied or not.
 *
 * For instance, this instance validates an access token sent to each end points
 * of API. If the access token is valid, this handleResponse() method returns
 * the information (a client ID, an ID of a remote user and a scope value).
 * If the access token is invalid, OAuthError will be thrown. The exception
 * has the reason why the token was judged as invalid.
 *
 * @author Yoichiro Tanaka
 */
export class ProtectedResourceEndpoint {

  private _accessTokenFetcherProvider: AccessTokenFetcherProvider
  private _dataHandlerFactory: DataHandlerFactory

  /**
   * Set the [[AccessTokenFetcherProvider]] instance.
   */
  set accessTokenFetcherProvider(value: AccessTokenFetcherProvider) {
    this._accessTokenFetcherProvider = value;
  }

  /**
   * Set the [[DataHandlerFactory]] instance.
   */
  set dataHandlerFactory(value: DataHandlerFactory) {
    this._dataHandlerFactory = value;
  }

  /**
	 * This method handles a request and judges whether the request can be
	 * applied or not.
	 *
	 * @param request This argument value has the information of the request.
	 * @return If the request is valid, this result has three informations (
	 * Client ID, Scope and User ID). Otherwise, this result has a reason
	 * why this request was judged as invalid.
	 */
  public async handleRequest(request: Request): Promise<Result<ProtectedResourceEndpointResponse>> {
    const accessTokenFetcher = this._accessTokenFetcherProvider.getfetcher(request)
    if (!accessTokenFetcher) {
      return Result.error(new InvalidRequest("Access token not found"))
    }
    const fetchResult = accessTokenFetcher.fetch(request)
    const token = fetchResult.token
    const dataHandler = this._dataHandlerFactory.create(request)
    const accessToken = await dataHandler.getAccessToken(token)
    if (!accessToken) {
      return Result.error(new InvalidToken("Invalid access token"))
    }
    const now = Date.now()
    if (accessToken.createdOn + accessToken.expiresIn * 1000 <= now) {
      return Result.error(new ExpiredToken())
    }
    const authInfo = await dataHandler.getAuthInfoById(accessToken.authId)
    if (!authInfo) {
      return Result.error(new InvalidToken("Invalid access token"))
    }
    if (!await dataHandler.validateClientById(authInfo.clientId)) {
      return Result.error(new InvalidToken("Invalid client"))
    }
    if (!await dataHandler.validateUserById(authInfo.userId)) {
      return Result.error(new InvalidToken("Invalid user"))
    }
    return Result.success(new ProtectedResourceEndpointResponse(
      authInfo.userId,
      authInfo.clientId,
      authInfo.scope
    ))
  }

}
