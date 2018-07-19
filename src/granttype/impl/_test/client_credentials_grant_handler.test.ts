import test from "ava";
import * as sinon from "sinon";
import {stubInterface} from "ts-sinon";
import {DataHandler} from "../../../data/data_handler";
import {Request} from "../../../models/request";
import {InvalidClient, InvalidGrant, InvalidRequest} from "../../../exceptions/oauth_error";
import {DefaultClientCredentialFetcherProvider} from "../../../fetcher/clientcredential/impl/default_client_credential_fetcher_provider";
import {ClientCredentialsGrantHandler} from "../client_credentials_grant_handler";
import {AccessToken} from "../../../models/access_token";
import {AuthInfo} from "../../../models/auth_info";
import {UnknownError} from "../../../exceptions";

const createRequestMockWithParams = (params: {[key: string]: string}): Request => {
  const stub = stubInterface<Request>()
  const func = sinon.stub()
  const parameterMap = new Map<string, string>()
  Object.keys(params).forEach(key => {
    func.withArgs(key).returns(params[key])
    parameterMap.set(key, params[key])
  })
  func.withArgs("client_id").returns("clientId1")
  func.withArgs("client_secret").returns("clientSecret1")
  stub["getParameter"] = func
  stub["getParameterMap"] = sinon.stub().returns(parameterMap)
  return stub
}

const createDataHandlerMock = (request: Request): DataHandler => {
  return stubInterface<DataHandler>({"getRequest": request})
}

test("ClientCredentialsGrantHandler returns InvalidRequest when client credential not found", async t => {
  const subject = new ClientCredentialsGrantHandler()
  subject.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()

  const request = stubInterface<Request>()
  const dataHandler = createDataHandlerMock(request)

  const actual = await subject.handleRequest(dataHandler)

  t.is(actual.isError(), true)
  t.is(actual.error instanceof InvalidRequest, true)
})

test("ClientCredentialsGrantHandler returns InvalidClient when userId is undefined", async t => {
  const subject = new ClientCredentialsGrantHandler()
  subject.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()

  const request = createRequestMockWithParams({})
  const dataHandler = createDataHandlerMock(request)
  dataHandler["getClientUserId"] = sinon.stub().returns(undefined)

  const actual = await subject.handleRequest(dataHandler)

  t.is(actual.isError(), true)
  t.is(actual.error instanceof InvalidClient, true)
})

test("ClientCredentialsGrantHandler returns InvalidClient when userId is empty", async t => {
  const subject = new ClientCredentialsGrantHandler()
  subject.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()

  const request = createRequestMockWithParams({})
  const dataHandler = createDataHandlerMock(request)
  dataHandler["getClientUserId"] = sinon.stub().returns("")

  const actual = await subject.handleRequest(dataHandler)

  t.is(actual.isError(), true)
  t.is(actual.error instanceof InvalidClient, true)
})

test("ClientCredentialsGrantHandler returns InvalidClient when authInfo not found", async t => {
  const subject = new ClientCredentialsGrantHandler()
  subject.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()

  const request = createRequestMockWithParams({})
  const dataHandler = createDataHandlerMock(request)
  dataHandler["getClientUserId"] = sinon.stub().returns("userId1")
  dataHandler["createOrUpdateAuthInfo"] = sinon.stub().returns(undefined)

  const actual = await subject.handleRequest(dataHandler)

  t.is(actual.isError(), true)
  t.is(actual.error instanceof InvalidGrant, true)
})

test("ClientCredentialsGrantHandler returns UnknownError when issuring access token failed", async t => {
  const subject = new ClientCredentialsGrantHandler()
  subject.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()

  const request = createRequestMockWithParams({"scope": "scope1"})
  const dataHandler = createDataHandlerMock(request)
  dataHandler["getClientUserId"] = sinon.stub().returns("userId1")
  const authInfo = new AuthInfo()
  authInfo.clientId = "clientId1"
  dataHandler["createOrUpdateAuthInfo"] = sinon.stub().returns(authInfo)
  dataHandler["createOrUpdateAccessToken"] = sinon.stub().returns(undefined)

  const actual = await subject.handleRequest(dataHandler)

  t.is(actual.isError(), true)
  t.is(actual.error instanceof UnknownError, true)
})

test("ClientCredentialsGrantHandler returns access token with simple response", async t => {
  const subject = new ClientCredentialsGrantHandler()
  subject.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()

  const request = createRequestMockWithParams({"scope": "scope1"})
  const dataHandler = createDataHandlerMock(request)
  dataHandler["getClientUserId"] = sinon.stub().returns("userId1")
  const authInfo = new AuthInfo()
  authInfo.clientId = "clientId1"
  dataHandler["createOrUpdateAuthInfo"] = sinon.stub().returns(authInfo)
  const accessToken = new AccessToken()
  accessToken.token = "accessToken1"
  dataHandler["createOrUpdateAccessToken"] = sinon.stub().returns(accessToken)

  const actual = await subject.handleRequest(dataHandler)

  t.is(actual.isError(), false)
  const result = actual.value
  t.is(result.tokenType, "Bearer")
  t.is(result.accessToken, "accessToken1")
  t.is(result.expiresIn, undefined)
  t.is(result.refreshToken, undefined)
  t.is(result.scope, undefined)
})

test("ClientCredentialsGrantHandler returns access token with full response", async t => {
  const subject = new ClientCredentialsGrantHandler()
  subject.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()

  const request = createRequestMockWithParams({"refresh_token": "refreshToken1"})
  const dataHandler = createDataHandlerMock(request)
  dataHandler["getClientUserId"] = sinon.stub().returns("userId1")
  const authInfo = new AuthInfo()
  authInfo.clientId = "clientId1"
  authInfo.redirectUri = "redirectUri1"
  authInfo.refreshToken = "refreshToken1"
  authInfo.scope = "scope1"
  dataHandler["createOrUpdateAuthInfo"] = sinon.stub().returns(authInfo)
  const accessToken = new AccessToken()
  accessToken.token = "accessToken1"
  accessToken.expiresIn = 123
  dataHandler["createOrUpdateAccessToken"] = sinon.stub().returns(accessToken)

  const actual = await subject.handleRequest(dataHandler)

  t.is(actual.isError(), false)
  const result = actual.value
  t.is(result.tokenType, "Bearer")
  t.is(result.accessToken, "accessToken1")
  t.is(result.expiresIn, 123)
  t.is(result.refreshToken, "refreshToken1")
  t.is(result.scope, "scope1")
})
