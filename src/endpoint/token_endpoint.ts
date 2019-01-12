import {DataHandlerFactory} from "../data/data_handler_factory";
import {GrantHandlerProvider} from "../granttype/grant_handler_provider";
import {ClientCredentialFetcherProvider} from "../fetcher/clientcredential/client_credential_fetcher_provider";
import {Request} from "../models/request";
import {InvalidClient, InvalidRequest, OAuthError, UnsupportedGrantType} from "../exceptions/oauth_error";

/**
	 * This class has two properties: A status code and JSON string as the result
	 * of issuing a token.
	 *
	 * @author Yoichiro Tanaka
	 */
export class TokenEndpointResponse {

  private _code: number
  private _body: string

  /**
   * Initialize this instance with arguments passed.
   * @param code The status code as the result of issuing a token.
   * @param body The JSON string which has a token information.
   */
  constructor(code: number, body: string) {
    this._code = code;
    this._body = body;
  }

  /**
   * Retrieve the status code value.
   * This status code will be 200 when the issuing token is succeeded.
   * If an error occurs, the code will be the 300 series value.
   * @return The HTTP status code value.
   */
  get code(): number {
    return this._code;
  }

  /**
   * Retrieve the JSON string which has a token information.
   * The JSON string has the access token, refresh token, expires_in
   * value and the scope string. If the issuing a token failed,
   * this json string has the error type and description.
   * @return The JSON string value.
   */
  get body(): string {
    return this._body;
  }

}

/**
 * This class provides the ability to issue a token with each grant flow.
 *
 * The actual procedure to issue the token is in charge of a [[GrantHandler]]
 * specified by a grant_type parameter value. This [[handleRequest]] method
 * fetches a client credential from the request, checks whether it is valid or
 * not, and delegates issuing the token to the [[GrantHandler]] instance.
 * As the result, a HTTP status code and a JSON string which has the token
 * information.
 *
 * @author Yoichiro Tanaka
 */
export class TokenEndpoint {

  private _dataHandlerFactory: DataHandlerFactory
  private _grantHandlerProvider: GrantHandlerProvider
  private _clientCredentialFetcherProvider: ClientCredentialFetcherProvider

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
	 * Set the [[GrantHandlerProvider]] instance.
	 * This class gets a [[GrantHandler]] instance using this provider object.
	 * The [[GrantHandlerProvider]] can determine what handler should be used
	 * to issue the token. The provider instance must be passed using this method
	 * before calling the [[handlerRequest]] method.
	 * @param value The [[GrantHandlerProvider]] instance.
	 */
  set grantHandlerProvider(value: GrantHandlerProvider) {
    this._grantHandlerProvider = value;
  }

  /**
	 * Set the [[ClientCredentialFetcher]] instance.
	 * This class doesn't have an ability to fetch a client credential information
	 * from the request, instead delegates this [[ClientCredentialFetcher]] instance.
	 * The fetcher instance must be passed using this method before calling the
	 * [[handlerRequest]] method.
	 * @param value The ClientCredentialFetcher instance.
	 */
  set clientCredentialFetcherProvider(value: ClientCredentialFetcherProvider) {
    this._clientCredentialFetcherProvider = value;
  }

  /**
	 * Handle the request and issue a token.
	 * This class is an entry point to issue the token. When this method receives
	 * the request, then this checks the request, determines the grant type,
	 * fetches the client credential information, and issues the token based
	 * on the content of the request. The result is composed of the status code
	 * and the JSON string. The status code will be 200 when the issuing token
	 * is succeeded. If an error occurs, the code will be the 300 series value.
	 * The JSON string has the access token, refresh token, expires_in value and
	 * the scope string.
	 * @param request The request instance.
	 * @return The response object which has the status code and JSON string.
	 */
  public async handleRequest(request: Request): Promise<TokenEndpointResponse> {
    const type = request.getParameter("grant_type")
    if (!type || type.length === 0) {
      return this.convertErrorToResponse(new InvalidRequest("grant_type not found"))
    }
    const grantHandler = this._grantHandlerProvider.getHandler(type)
    if (!grantHandler) {
      return this.convertErrorToResponse(new UnsupportedGrantType(""))
    }
    const dataHandler = this._dataHandlerFactory.create(request)
    const clientCredentialFetcher = this._clientCredentialFetcherProvider.getfetcher(request)
    if (!clientCredentialFetcher) {
      return this.convertErrorToResponse(new InvalidRequest("Client credential not found"))
    }
    const clientCredential = clientCredentialFetcher.fetch(request)
    const clientId = clientCredential.clientId
    const clientSecret = clientCredential.clientSecret
    if (!await dataHandler.validateClient(clientId, clientSecret, type)) {
      return this.convertErrorToResponse(new InvalidClient(""))
    }
    const result = await grantHandler.handleRequest(dataHandler)
    if (result.isError()) {
      return this.convertErrorToResponse(result.error)
    }
    return new TokenEndpointResponse(200, result.value.toJson())
  }

  private convertErrorToResponse(error: OAuthError): TokenEndpointResponse {
    return new TokenEndpointResponse(error.code, error.toJson())
  }

}
