import test from "ava";
import {stubInterface} from "ts-sinon";
import * as sinon from "sinon";
import {ProtectedResourceEndpoint, ProtectedResourceEndpointResponse} from "../protected_resource_endpoint";
import {Request} from "../../models/request";
import {AccessTokenFetcherProvider} from "../../fetcher/accesstoken/access_token_fetcher_provider";
import {ExpiredToken, InvalidRequest, InvalidToken} from "../../exceptions/oauth_error";
import {DataHandler} from "../../data/data_handler";
import {DataHandlerFactory} from "../../data/data_handler_factory";
import {AuthHeaderAccessTokenFetcher} from "../../fetcher/accesstoken/impl/auth_header_access_token_fetcher";
import {AccessToken} from "../../models/access_token";
import {AuthInfo} from "../../models/auth_info";

test("ProtectedResourceEndpointResponse has some properties", t => {
  const subject = new ProtectedResourceEndpointResponse("userId1", "clientId1", "scope1")

  t.is(subject.clientId, "clientId1")
  t.is(subject.userId, "userId1")
  t.is(subject.scope, "scope1")
})

const createRequestMock = (headers: {[key: string]: string}): Request => {
  const stub = stubInterface<Request>()
  const funcHeaders = sinon.stub()
  Object.keys(headers).forEach(key => {
    funcHeaders.withArgs(key).returns(headers[key])
  })
  stub["getHeader"] = funcHeaders
  return stub
}

test("ProtectedResourceEndpoint returns an error response when access_token not specified", async t => {
  const request = createRequestMock({})
  const subject = new ProtectedResourceEndpoint()
  const accessTokenFetcherProvider = new AccessTokenFetcherProvider()
  accessTokenFetcherProvider.fetchers = []
  subject.accessTokenFetcherProvider = accessTokenFetcherProvider
  const response = await subject.handleRequest(request)
  t.is(response.isError(), true)
  t.is(response.error instanceof InvalidRequest, true)
})

test("ProtectedResourceEndpoint returns an error response when access_token not found", async t => {
  const request = createRequestMock({
    "Authorization": "Bearer Y2xpZW50X2lkX3ZhbHVlOmNsaWVudF9zZWNyZXRfdmFsdWU="
  })
  const subject = new ProtectedResourceEndpoint()
  const dataHandler = stubInterface<DataHandler>()
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })
  subject.dataHandlerFactory = dataHandlerFactory
  const accessTokenFetcherProvider = new AccessTokenFetcherProvider()
  accessTokenFetcherProvider.fetchers = [
    new AuthHeaderAccessTokenFetcher()
  ]
  subject.accessTokenFetcherProvider = accessTokenFetcherProvider
  const response = await subject.handleRequest(request)
  t.is(response.isError(), true)
  t.is(response.error instanceof InvalidToken, true)
})

test("ProtectedResourceEndpoint returns an error response when access_token expired", async t => {
  const request = createRequestMock({
    "Authorization": "Bearer Y2xpZW50X2lkX3ZhbHVlOmNsaWVudF9zZWNyZXRfdmFsdWU="
  })
  const subject = new ProtectedResourceEndpoint()
  const accessToken = new AccessToken()
  accessToken.createdOn = Date.now() - (24 * 60 * 60 * 1000)
  accessToken.expiresIn = 0
  const dataHandler = stubInterface<DataHandler>({
    getRequest: request,
    getAccessToken: accessToken
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })
  subject.dataHandlerFactory = dataHandlerFactory
  const accessTokenFetcherProvider = new AccessTokenFetcherProvider()
  accessTokenFetcherProvider.fetchers = [
    new AuthHeaderAccessTokenFetcher()
  ]
  subject.accessTokenFetcherProvider = accessTokenFetcherProvider
  const response = await subject.handleRequest(request)
  t.is(response.isError(), true)
  t.is(response.error instanceof ExpiredToken, true)
})

test("ProtectedResourceEndpoint returns an error response when authInfo not found", async t => {
  const request = createRequestMock({
    "Authorization": "Bearer Y2xpZW50X2lkX3ZhbHVlOmNsaWVudF9zZWNyZXRfdmFsdWU="
  })
  const subject = new ProtectedResourceEndpoint()
  const accessToken = new AccessToken()
  accessToken.createdOn = Date.now()
  accessToken.expiresIn = 3600
  accessToken.authId = "authId1"
  const dataHandler = stubInterface<DataHandler>({
    getRequest: request,
    getAccessToken: accessToken
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })
  subject.dataHandlerFactory = dataHandlerFactory
  const accessTokenFetcherProvider = new AccessTokenFetcherProvider()
  accessTokenFetcherProvider.fetchers = [
    new AuthHeaderAccessTokenFetcher()
  ]
  subject.accessTokenFetcherProvider = accessTokenFetcherProvider
  const response = await subject.handleRequest(request)
  t.is(response.isError(), true)
  t.is(response.error instanceof InvalidToken, true)
})

test("ProtectedResourceEndpoint returns an error response when client is invalid", async t => {
  const request = createRequestMock({
    "Authorization": "Bearer Y2xpZW50X2lkX3ZhbHVlOmNsaWVudF9zZWNyZXRfdmFsdWU="
  })
  const subject = new ProtectedResourceEndpoint()
  const accessToken = new AccessToken()
  accessToken.createdOn = Date.now()
  accessToken.expiresIn = 3600
  accessToken.authId = "authId1"
  const authInfo = new AuthInfo()
  authInfo.clientId = "clientId1"
  const dataHandler = stubInterface<DataHandler>({
    getRequest: request,
    getAccessToken: accessToken,
    getAuthInfoById: authInfo,
    validateClientById: false
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })
  subject.dataHandlerFactory = dataHandlerFactory
  const accessTokenFetcherProvider = new AccessTokenFetcherProvider()
  accessTokenFetcherProvider.fetchers = [
    new AuthHeaderAccessTokenFetcher()
  ]
  subject.accessTokenFetcherProvider = accessTokenFetcherProvider
  const response = await subject.handleRequest(request)
  t.is(response.isError(), true)
  t.is(response.error instanceof InvalidToken, true)
})

test("ProtectedResourceEndpoint returns an error response when user is invalid", async t => {
  const request = createRequestMock({
    "Authorization": "Bearer Y2xpZW50X2lkX3ZhbHVlOmNsaWVudF9zZWNyZXRfdmFsdWU="
  })
  const subject = new ProtectedResourceEndpoint()
  const accessToken = new AccessToken()
  accessToken.createdOn = Date.now()
  accessToken.expiresIn = 3600
  accessToken.authId = "authId1"
  const authInfo = new AuthInfo()
  authInfo.clientId = "clientId1"
  authInfo.userId = "userId1"
  const dataHandler = stubInterface<DataHandler>({
    getRequest: request,
    getAccessToken: accessToken,
    getAuthInfoById: authInfo,
    validateClientById: true,
    validateUserById: false
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })
  subject.dataHandlerFactory = dataHandlerFactory
  const accessTokenFetcherProvider = new AccessTokenFetcherProvider()
  accessTokenFetcherProvider.fetchers = [
    new AuthHeaderAccessTokenFetcher()
  ]
  subject.accessTokenFetcherProvider = accessTokenFetcherProvider
  const response = await subject.handleRequest(request)
  t.is(response.isError(), true)
  t.is(response.error instanceof InvalidToken, true)
})

test("ProtectedResourceEndpoint returns a success response", async t => {
  const request = createRequestMock({
    "Authorization": "Bearer Y2xpZW50X2lkX3ZhbHVlOmNsaWVudF9zZWNyZXRfdmFsdWU="
  })
  const subject = new ProtectedResourceEndpoint()
  const accessToken = new AccessToken()
  accessToken.createdOn = Date.now()
  accessToken.expiresIn = 3600
  accessToken.authId = "authId1"
  const authInfo = new AuthInfo()
  authInfo.clientId = "clientId1"
  authInfo.userId = "userId1"
  authInfo.scope = "scope1"
  const dataHandler = stubInterface<DataHandler>({
    getRequest: request,
    getAccessToken: accessToken,
    getAuthInfoById: authInfo,
    validateClientById: true,
    validateUserById: true
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })
  subject.dataHandlerFactory = dataHandlerFactory
  const accessTokenFetcherProvider = new AccessTokenFetcherProvider()
  accessTokenFetcherProvider.fetchers = [
    new AuthHeaderAccessTokenFetcher()
  ]
  subject.accessTokenFetcherProvider = accessTokenFetcherProvider
  const response = await subject.handleRequest(request)
  t.is(response.isError(), false)
  const result = response.value
  t.is(result.userId, "userId1")
  t.is(result.clientId, "clientId1")
  t.is(result.scope, "scope1")
})
