import {DataHandlerFactory} from "../data";
import {Request} from "../models";
import {InvalidRequest, InvalidClient, UnknownError} from "../exceptions";
import {Result} from "../utils";

export class AuthorizationEndpointResponse {

  private _redirectUri: string
  private _query: {[key: string]: string | number} | undefined
  private _fragment: {[key: string]: string | number} | undefined

  get redirectUri(): string {
    return this._redirectUri
  }

  set redirectUri(value: string) {
    this._redirectUri = value
  }

  get query(): { [p: string]: string | number } | undefined {
    return this._query
  }

  set query(value: { [p: string]: string | number } | undefined) {
    this._query = value
  }

  get fragment(): { [p: string]: string | number } | undefined {
    return this._fragment
  }

  set fragment(value: { [p: string]: string | number } | undefined) {
    this._fragment = value
  }

}

export class AuthorizationEndpoint {

  private _dataHandlerFactory: DataHandlerFactory
  private _allowedResponseTypes: string[]

  set dataHandlerFactory(value: DataHandlerFactory) {
    this._dataHandlerFactory = value;
  }

  set allowedResponseTypes(value: string[]) {
    this._allowedResponseTypes = value;
  }

  async handleRequest(request: Request): Promise<Result<void>> {
    const responseType = request.getParameter("response_type")
    if (!responseType || responseType.length === 0) {
      return Result.error(new InvalidRequest("'response_type' not found"))
    }
    const responseTypes = responseType.split(" ")
    for (const x of responseTypes) {
      if (this._allowedResponseTypes.indexOf(x) === -1) {
        return Result.error(new InvalidRequest("'response_type' not allowed"))
      }
    }

    const dataHandler = this._dataHandlerFactory.create(request)

    const clientId = request.getParameter("client_id")
    if (!clientId || clientId.length === 0) {
      return Result.error(new InvalidRequest("'client_id' not found"))
    }
    if (!await dataHandler.validateClientById(clientId)) {
      return Result.error(new InvalidClient(""))
    }
    if (!await dataHandler.validateClientForAuthorization(clientId, responseType)) {
      return Result.error(new InvalidClient("'response_type' not allowed for this 'client_id'"))
    }

    const redirectUri = request.getParameter("redirect_uri")
    if (!redirectUri || redirectUri.length === 0) {
      return Result.error(new InvalidRequest("'redirect_uri' not found"))
    }
    if (!await dataHandler.validateRedirectUri(clientId, redirectUri)) {
      return Result.error(new InvalidClient("'redirect_uri' is invalid"))
    }

    return Result.success()
  }

  async allow(request: Request): Promise<Result<AuthorizationEndpointResponse>> {
    const dataHandler = this._dataHandlerFactory.create(request)

    const responseType = request.getParameter("response_type")
    if (!responseType || responseType.length === 0) {
      return Result.error(new InvalidRequest("'response_type' not found"))
    }
    const responseTypes = responseType.split(" ")
    const clientId = request.getParameter("client_id")
    if (!clientId || clientId.length === 0) {
      return Result.error(new InvalidRequest("'client_id' not found"))
    }
    const userId = request.getParameter("user_id")
    if (!userId || userId.length === 0) {
      return Result.error(new InvalidRequest("'user_id' not found"))
    }
    const redirectUri = request.getParameter("redirect_uri")
    if (!redirectUri || redirectUri.length === 0) {
      return Result.error(new InvalidRequest("'redirectUri' not found"))
    }
    const scope = request.getParameter("scope")

    const authInfo = await dataHandler.createOrUpdateAuthInfo(clientId, userId, scope)
    if (!authInfo) {
      return Result.error(new InvalidClient(""))
    }

    let accessToken = undefined
    if (responseTypes.indexOf("token") !== -1) {
      accessToken = await dataHandler.createOrUpdateAccessToken(authInfo)
      if (!accessToken) {
        return Result.error(new UnknownError("Access token can't be created"))
      }
    }

    const params: {[key: string]: string | number} = {}

    const state = request.getParameter("state")
    if (state) {
      params["state"] = state
    }

    if (accessToken) {
      params["access_token"] = accessToken.token
      params["token_type"] = "Bearer"
      params["expires_in"] = accessToken.expiresIn
    }

    if (responseTypes.indexOf("code") !== -1) {
      params["code"] = authInfo.code
    }

    const response = new AuthorizationEndpointResponse()
    response.redirectUri = redirectUri
    if (responseTypes.length === 1 && responseTypes[0] === "code") {
      response.query = params
    } else {
      response.fragment = params
    }
    return Result.success(response)
  }

  async deny(request: Request): Promise<Result<AuthorizationEndpointResponse>> {
    const responseType = request.getParameter("response_type")
    if (!responseType || responseType.length === 0) {
      return Result.error(new InvalidRequest("'response_type' not found"))
    }
    const responseTypes = responseType.split(" ")
    const redirectUri = request.getParameter("redirect_uri")
    if (!redirectUri || redirectUri.length === 0) {
      return Result.error(new InvalidRequest("'redirectUri' not found"))
    }

    const params: {[key: string]: string | number} = {}

    params["error"] = "access_denied"
    const state = request.getParameter("state")
    if (state) {
      params["state"] = state
    }

    const response = new AuthorizationEndpointResponse()
    response.redirectUri = redirectUri
    if (responseTypes.length === 1 && responseTypes[0] === "code") {
      response.query = params
    } else {
      response.fragment = params
    }
    return Result.success(response)
  }

}
