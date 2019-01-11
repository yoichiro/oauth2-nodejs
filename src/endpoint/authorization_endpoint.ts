import {DataHandlerFactory} from "../data";
import {Request} from "../models";
import {InvalidRequest, InvalidClient, UnknownError, InvalidScope} from "../exceptions";
import {Result} from "../utils";

/**
 * This response model class has each parameter's name and value for authorization response.
 *
 * @author Yoichiro Tanaka
 */
export class AuthorizationEndpointResponse {

  private _redirectUri: string
  private _query: {[key: string]: string | number} | undefined
  private _fragment: {[key: string]: string | number} | undefined

  /**
   * The redirectUri string to navigate the user to the client.
   */
  get redirectUri(): string {
    return this._redirectUri
  }

  set redirectUri(value: string) {
    this._redirectUri = value
  }

  /**
   * The key-value pairs that should be set as query parameter.
   */
  get query(): { [p: string]: string | number } | undefined {
    return this._query
  }

  set query(value: { [p: string]: string | number } | undefined) {
    this._query = value
  }

  /**
   * The key-value pairs that should be set as fragment.
   */
  get fragment(): { [p: string]: string | number } | undefined {
    return this._fragment
  }

  set fragment(value: { [p: string]: string | number } | undefined) {
    this._fragment = value
  }

}

/**
 * This class provides an ability for authorization endpoint.
 *
 * This class cosists of three features: [[handleRequest]], [[allow]] and [[deny]].
 * The [[handleRequest]] is called at starting the authorization, for example, when a client
 * want to send a request to authorize. On the other hand, the [[allow]] and [[deny]]
 * are called when the user decided whether allowing or denying the authorization request.
 * Currently, this endpoint is necessary to process the Authorization Code Grant and
 * Implicit Grant.
 *
 * @author Yoichiro Tanaka
 */
export class AuthorizationEndpoint {

  private _dataHandlerFactory: DataHandlerFactory
  private _allowedResponseTypes: string[]

  /**
   * Set the [[DataHandlerFactory]] instance.
   */
  set dataHandlerFactory(value: DataHandlerFactory) {
    this._dataHandlerFactory = value;
  }

  /**
   * Set the array of response types allowed by your server.
   */
  set allowedResponseTypes(value: string[]) {
    this._allowedResponseTypes = value;
  }

  /**
   * Check parameters for authorization request.
   *
   * Actually, this method checks the following parameters:
   *
   * <ul>
   * <li>response_type</li>
   * <li>client_id</li>
   * <li>redirect_uri</li>
   * <li>scope</li>
   * </ul>
   *
   * @param request The request object that has each parameter name and value.
   * @return If all parameters are valid, return the [[Result]] object that
   * represents successfully. Otherwise, return the [[Result]] object that has
   * an error information.
   */
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

    const scope = request.getParameter("scope")
    if (!await dataHandler.validateScope(clientId, scope)) {
      return Result.error(new InvalidScope(""))
    }

    return Result.success()
  }

  /**
   * Handle the decision that the user allows the authorization request.
   *
   * This method is usually called when the user allowed the authorization request
   * on the authorization page. You can call this method to create [[AuthInfo]]
   * and/or access token according to the requested response type at the time.
   *
   * @param request The [[Request]] object that has parameters: response_type,
   * client_id, user_id, redirect_uri, state and scope.
   * @return The [[Result]] object that has [[AuthorizationEndpointResponse]] object
   * with each values to respond as query parameters ro fragments.
   */
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
      accessToken = await dataHandler.createOrUpdateAccessToken(authInfo, "implicit")
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

  /**
   * Handle the decision that the user denies the authorization request.
   *
   * This method is usually called when the user denied the authorization request
   * on the authorization page. You can call this method to inform that to the user.
   *
   * @param request The [[Request]] object that has parameters: response_type, state
   * and redirect_uri.
   * @return The [[Result]] object that has [[AuthorizationEndpointResponse]] object
   * with an error message to respond as query parameters ro fragments.
   */
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
