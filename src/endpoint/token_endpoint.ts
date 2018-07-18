import {DataHandlerFactory} from "../data/data_handler_factory";
import {GrantHandlerProvider} from "../granttype/grant_handler_provider";
import {ClientCredentialFetcherProvider} from "../fetcher/clientcredential/client_credential_fetcher_provider";
import {Request} from "../models/request";
import {InvalidClient, InvalidRequest, OAuthError, UnsupportedGrantType} from "../exceptions/oauth_error";

export class TokenEndpointResponse {

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

export class TokenEndpoint {

  private _dataHandlerFactory: DataHandlerFactory
  private _grantHandlerProvider: GrantHandlerProvider
  private _clientCredentialFetcherProvider: ClientCredentialFetcherProvider


  set dataHandlerFactory(value: DataHandlerFactory) {
    this._dataHandlerFactory = value;
  }

  set grantHandlerProvider(value: GrantHandlerProvider) {
    this._grantHandlerProvider = value;
  }

  set clientCredentialFetcherProvider(value: ClientCredentialFetcherProvider) {
    this._clientCredentialFetcherProvider = value;
  }

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
