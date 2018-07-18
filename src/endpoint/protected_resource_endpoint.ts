import {AccessTokenFetcherProvider} from "../fetcher/accesstoken/access_token_fetcher_provider";
import {DataHandlerFactory} from "../data/data_handler_factory";
import {Request} from "../models/request";
import {Result} from "../utils/result";
import {ExpiredToken, InvalidRequest, InvalidToken} from "../exceptions/oauth_error";

export class ProtectedResourceEndpointResponse {

  private _userId: string
  private _clientId: string
  private _scope: string

  constructor(userId: string, clientId: string, scope: string) {
    this._userId = userId;
    this._clientId = clientId;
    this._scope = scope;
  }

  get userId(): string {
    return this._userId;
  }

  get clientId(): string {
    return this._clientId;
  }

  get scope(): string {
    return this._scope;
  }

}

export class ProtectedResourceEndpoint {

  private _accessTokenFetcherProvider: AccessTokenFetcherProvider
  private _dataHandlerFactory: DataHandlerFactory


  set accessTokenFetcherProvider(value: AccessTokenFetcherProvider) {
    this._accessTokenFetcherProvider = value;
  }

  set dataHandlerFactory(value: DataHandlerFactory) {
    this._dataHandlerFactory = value;
  }

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
