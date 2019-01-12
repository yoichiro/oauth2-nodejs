import {Request} from "../models";
import {InvalidRequest, InvalidToken, OAuthError} from "../exceptions";
import {DataHandlerFactory} from "../data";

/**
 * This class has an information of the response from the [[TokeninfoEndpoint]].
 *
 * @author Yoichiro Tanaka
 */
export class TokeninfoEndpointResponse {

  private _code: number
  private _body: string

  /**
   * Initialize this instance.
   * @param code The HTTP Status Code value.
   * @param body The HTTP Response Body value.
   */
  constructor(code: number, body: string) {
    this._code = code;
    this._body = body;
  }

  /**
   * Retrieve the HTTP Status Code value.
   */
  get code(): number {
    return this._code;
  }

  /**
   * Retrieve the HTTP Response Body value.
   */
  get body(): string {
    return this._body;
  }

}

/**
 * This class has an ability to provide a token information to build the
 * tokeninfo endpoint.
 *
 * The [[handleRequest]] method receives an request that has an access token.
 * Then, it returns the information of the passed access token.
 *
 * @author Yoichiro Tanaka
 */
export class TokeninfoEndpoint {

  private _dataHandlerFactory: DataHandlerFactory

  /**
	 * Set the [[DataHandlerFactory]] instance.
	 * This class gets a [[DataHandler]] instance using this factory object.
	 * The factory instance must be passed using this method before calling
	 * the [[handlerRequest]] method.
	 * @param value The [[DataHandlerFactory]] instance.
	 */
  set dataHandlerFactory(value: DataHandlerFactory) {
    this._dataHandlerFactory = value;
  }

  /**
   * Return the information of the passed access token.
   * When receiving the request, this method retrieves the access_token parameter value,
   * fetches the access token information and the auth info, and constructs the response
   * as JSON string.
   * @param request The request object which has an access_token parameter.
   */
  public async handleRequest(request: Request): Promise<TokeninfoEndpointResponse> {
    const accessToken = request.getParameter("access_token")
    if (!accessToken || accessToken.length === 0) {
      return this.convertErrorToResponse(new InvalidRequest("access_token not found"))
    }
    const dataHandler = this._dataHandlerFactory.create(request)
    const accessTokenInfo = await dataHandler.getAccessToken(accessToken)
    if (!accessTokenInfo) {
      return this.convertErrorToResponse(new InvalidToken(""))
    }
    const authInfo = await dataHandler.getAuthInfoById(accessTokenInfo.authId)
    if (!authInfo) {
      return this.convertErrorToResponse(new InvalidToken(""))
    }
    return new TokeninfoEndpointResponse(
      200,
      JSON.stringify({
        "aud": authInfo.clientId,
        "sub": authInfo.userId,
        "scope": authInfo.scope,
        "expires_in": String(accessTokenInfo.expiresIn)
      })
    )
  }

  private convertErrorToResponse(error: OAuthError): TokeninfoEndpointResponse {
    return new TokeninfoEndpointResponse(error.code, error.toJson())
  }

}
