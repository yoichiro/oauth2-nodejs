import test from "ava";
import {stubInterface} from "ts-sinon";
import * as sinon from "sinon";
import {TokenEndpoint, TokenEndpointResponse} from "../token_endpoint";
import {Request} from "../../models/request";
import {DataHandlerFactory} from "../../data/data_handler_factory";
import {DefaultClientCredentialFetcherProvider} from "../../fetcher/clientcredential/impl/default_client_credential_fetcher_provider";
import {GrantHandlerProvider} from "../../granttype/grant_handler_provider";
import {RefreshTokenGrantHandler} from "../../granttype/impl/refresh_token_grant_handler";
import {GrantHandler} from "../../granttype/grant_handler";
import {DataHandler} from "../../data/data_handler";
import {AuthInfo} from "../../models/auth_info";
import {AccessToken} from "../../models/access_token";

test("TokenEndpointResponse has some properties", t => {
  const subject = new TokenEndpointResponse(123, "body1")

  t.is(subject.code, 123)
  t.is(subject.body, "body1")
})

const createRequestMock = (params: {[key: string]: string}, headers: {[key: string]: string}): Request => {
  const stub = stubInterface<Request>()
  const funcParams = sinon.stub()
  const parameterMap = new Map<string, string>()
  Object.keys(params).forEach(key => {
    funcParams.withArgs(key).returns(params[key])
    parameterMap.set(key, params[key])
  })
  stub["getParameter"] = funcParams
  stub["getParameterMap"] = sinon.stub().returns(parameterMap)
  const funcHeaders = sinon.stub()
  Object.keys(headers).forEach(key => {
    funcHeaders.withArgs(key).returns(headers[key])
  })
  stub["getHeader"] = funcHeaders
  return stub
}

const createTokenEndpoint = (dataHandlerFactory: DataHandlerFactory): TokenEndpoint => {
  const tokenEndpoint = new TokenEndpoint()
  tokenEndpoint.dataHandlerFactory = dataHandlerFactory
  tokenEndpoint.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()
  const grantHandlerProvider = new GrantHandlerProvider()
  const grantHandlerMap = new Map<string, GrantHandler>()
  const refreshTokenGrantHandler = new RefreshTokenGrantHandler()
  refreshTokenGrantHandler.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()
  grantHandlerMap.set("refresh_token", refreshTokenGrantHandler)
  grantHandlerProvider.handlers = grantHandlerMap
  tokenEndpoint.grantHandlerProvider = grantHandlerProvider
  return tokenEndpoint
}

test("TokenEndpoint returns an error response when grant_type not found", async t => {
  const request = createRequestMock({}, {})
  const subject = new TokenEndpoint()

  const response = await subject.handleRequest(request)

  t.is(response.code, 400)
  t.is(response.body, "{\"error\":\"invalid_request\",\"error_description\":\"grant_type not found\"}")
})

test("TokenEndpoint returns an error response when grant_type not supported", async t => {
  const request = createRequestMock({"grant_type": "evil"}, {})
  const dataHandlerFactory = stubInterface<DataHandlerFactory>()
  const subject = createTokenEndpoint(dataHandlerFactory)

  const response = await subject.handleRequest(request)

  t.is(response.code, 400)
  t.is(response.body, "{\"error\":\"unsupported_grant_type\"}")
})

test("TokenEndpoint returns an error response when client_id not found", async t => {
  const request = createRequestMock({"grant_type": "refresh_token"}, {})
  const dataHandlerFactory = stubInterface<DataHandlerFactory>()
  const subject = createTokenEndpoint(dataHandlerFactory)

  const response = await subject.handleRequest(request)

  t.is(response.code, 400)
  t.is(response.body, "{\"error\":\"invalid_request\",\"error_description\":\"Client credential not found\"}")
})

test("TokenEndpoint returns an error response when client_secret not found", async t => {
  const request = createRequestMock({
    "grant_type": "refresh_token",
    "client_id": "clientId1"
  }, {})
  const dataHandlerFactory = stubInterface<DataHandlerFactory>()
  const subject = createTokenEndpoint(dataHandlerFactory)

  const response = await subject.handleRequest(request)

  t.is(response.code, 400)
  t.is(response.body, "{\"error\":\"invalid_request\",\"error_description\":\"Client credential not found\"}")
})

test("TokenEndpoint returns an error response when client is invalid", async t => {
  const request = createRequestMock({
    "grant_type": "refresh_token",
    "client_id": "clientId1",
    "client_secret": "clientSecret1"
  }, {})
  const dataHandler = stubInterface<DataHandler>({validateClient: false})
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({create: dataHandler})
  const subject = createTokenEndpoint(dataHandlerFactory)

  const response = await subject.handleRequest(request)

  t.is(response.code, 401)
  t.is(response.body, "{\"error\":\"invalid_client\"}")
})

test("TokenEndpoint returns an error response when clientId is invalid", async t => {
  const request = createRequestMock({
    "grant_type": "refresh_token",
    "client_id": "clientId1",
    "client_secret": "clientSecret1",
    "refresh_token": "refreshToken1"
  }, {})
  const authInfo = new AuthInfo()
  authInfo.clientId = "clientId2"
  const accessToken = new AccessToken()
  accessToken.token = "accessToken1"
  const dataHandler = stubInterface<DataHandler>({
    getRequest: request,
    validateClient: true,
    getAuthInfoByRefreshToken: authInfo,
    createOrUpdateAccessToken: accessToken
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({create: dataHandler})
  const subject = createTokenEndpoint(dataHandlerFactory)

  const response = await subject.handleRequest(request)

  t.is(response.code, 401)
  t.is(response.body, "{\"error\":\"invalid_client\"}")
})

test("TokenEndpoint returns an success response", async t => {
  const request = createRequestMock({
    "grant_type": "refresh_token",
    "client_id": "clientId1",
    "client_secret": "clientSecret1",
    "refresh_token": "refreshToken1"
  }, {})
  const authInfo = new AuthInfo()
  authInfo.clientId = "clientId1"
  const accessToken = new AccessToken()
  accessToken.token = "accessToken1"
  const dataHandler = stubInterface<DataHandler>({
    getRequest: request,
    validateClient: true,
    getAuthInfoByRefreshToken: authInfo,
    createOrUpdateAccessToken: accessToken
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({create: dataHandler})
  const subject = createTokenEndpoint(dataHandlerFactory)

  const response = await subject.handleRequest(request)

  t.is(response.code, 200)
  t.is(response.body, "{\"token_type\":\"Bearer\",\"access_token\":\"accessToken1\"}")
})
