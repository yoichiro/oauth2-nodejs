import {Request} from "../models";
import {InvalidRequest, InvalidToken, OAuthError} from "../exceptions";
import {DataHandlerFactory} from "../data";

export class TokeninfoEndpointResponse {

  private _code: number
  private _body: string

  constructor(code: number, body: string) {
    this._code = code;
    this._body = body;
  }

  get code(): number {
    return this._code;
  }

  get body(): string {
    return this._body;
  }

}

export class TokeninfoEndpoint {

  private _dataHandlerFactory: DataHandlerFactory

  set dataHandlerFactory(value: DataHandlerFactory) {
    this._dataHandlerFactory = value;
  }

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
