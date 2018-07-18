import test from "ava";
import {stubInterface} from "ts-sinon";
import * as sinon from "sinon";
import {DataHandler} from "../../../data/data_handler";
import {Request} from "../../../models/request";
import {InvalidClient, InvalidGrant, InvalidRequest, RedirectUriMismatch} from "../../../exceptions/oauth_error";
import {DefaultClientCredentialFetcherProvider} from "../../../fetcher/clientcredential/impl/default_client_credential_fetcher_provider";
import {AuthorizationCodeGrantHandler} from "../authorization_code_grant_handler";
import {AuthInfo} from "../../../models/auth_info";
import {AccessToken} from "../../../models/access_token";

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

test("AuthorizationCodeGrantHandler returns InvalidRequest when client credential not found", async t => {
  const subject = new AuthorizationCodeGrantHandler()
  subject.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()

  const request = stubInterface<Request>()
  const dataHandler = createDataHandlerMock(request)

  const actual = await subject.handleRequest(dataHandler)

  t.is(actual.isError(), true)
  t.is(actual.error instanceof InvalidRequest, true)
})

test("AuthorizationCodeGrantHandler returns InvalidRequest when code not found", async t => {
  const subject = new AuthorizationCodeGrantHandler()
  subject.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()

  const request = createRequestMockWithParams({})
  const dataHandler = createDataHandlerMock(request)

  const actual = await subject.handleRequest(dataHandler)

  t.is(actual.isError(), true)
  t.is(actual.error instanceof InvalidRequest, true)
})

test("AuthorizationCodeGrantHandler returns InvalidRequest when redirect_uri not found", async t => {
  const subject = new AuthorizationCodeGrantHandler()
  subject.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()

  const request = createRequestMockWithParams({"code": "code1"})
  const dataHandler = createDataHandlerMock(request)

  const actual = await subject.handleRequest(dataHandler)

  t.is(actual.isError(), true)
  t.is(actual.error instanceof InvalidRequest, true)
})

test("AuthorizationCodeGrantHandler returns InvalidGrant when authInfo not found", async t => {
  const subject = new AuthorizationCodeGrantHandler()
  subject.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()

  const request = createRequestMockWithParams({"code": "code1", "redirect_uri": "redirectUri1"})
  const dataHandler = createDataHandlerMock(request)

  const actual = await subject.handleRequest(dataHandler)

  t.is(actual.isError(), true)
  t.is(actual.error instanceof InvalidGrant, true)
})

test("AuthorizationCodeGrantHandler returns InvalidClient when client_id mismatch", async t => {
  const subject = new AuthorizationCodeGrantHandler()
  subject.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()

  const request = createRequestMockWithParams({"code": "code1", "redirect_uri": "redirectUri1"})
  const dataHandler = createDataHandlerMock(request)
  const authInfo = new AuthInfo()
  authInfo.clientId = "clientId2"
  dataHandler["getAuthInfoByCode"] = sinon.stub().returns(authInfo)

  const actual = await subject.handleRequest(dataHandler)

  t.is(actual.isError(), true)
  t.is(actual.error instanceof InvalidClient, true)
})

test("AuthorizationCodeGrantHandler returns RedirectUriMismatch when redirect_uri not set", async t => {
  const subject = new AuthorizationCodeGrantHandler()
  subject.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()

  const request = createRequestMockWithParams({"code": "code1", "redirect_uri": "redirectUri1"})
  const dataHandler = createDataHandlerMock(request)
  const authInfo = new AuthInfo()
  authInfo.clientId = "clientId1"
  dataHandler["getAuthInfoByCode"] = sinon.stub().returns(authInfo)

  const actual = await subject.handleRequest(dataHandler)

  t.is(actual.isError(), true)
  t.is(actual.error instanceof RedirectUriMismatch, true)
})

test("AuthorizationCodeGrantHandler returns RedirectUriMismatch when redirect_uri not matched", async t => {
  const subject = new AuthorizationCodeGrantHandler()
  subject.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()

  const request = createRequestMockWithParams({"code": "code1", "redirect_uri": "redirectUri1"})
  const dataHandler = createDataHandlerMock(request)
  const authInfo = new AuthInfo()
  authInfo.clientId = "clientId1"
  authInfo.redirectUri = "redirectUri2"
  dataHandler["getAuthInfoByCode"] = sinon.stub().returns(authInfo)

  const actual = await subject.handleRequest(dataHandler)

  t.is(actual.isError(), true)
  t.is(actual.error instanceof RedirectUriMismatch, true)
})

test("AuthorizationCodeGrantHandler returns access token with simple response", async t => {
  const subject = new AuthorizationCodeGrantHandler()
  subject.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()

  const request = createRequestMockWithParams({"code": "code1", "redirect_uri": "redirectUri1"})
  const dataHandler = createDataHandlerMock(request)
  const authInfo = new AuthInfo()
  authInfo.clientId = "clientId1"
  authInfo.redirectUri = "redirectUri1"
  dataHandler["getAuthInfoByCode"] = sinon.stub().returns(authInfo)
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

test("AuthorizationCodeGrantHandler returns access token with full response", async t => {
  const subject = new AuthorizationCodeGrantHandler()
  subject.clientCredentialFetcherProvider = new DefaultClientCredentialFetcherProvider()

  const request = createRequestMockWithParams({"code": "code1", "redirect_uri": "redirectUri1"})
  const dataHandler = createDataHandlerMock(request)
  const authInfo = new AuthInfo()
  authInfo.clientId = "clientId1"
  authInfo.redirectUri = "redirectUri1"
  authInfo.refreshToken = "refreshToken1"
  authInfo.scope = "scope1"
  dataHandler["getAuthInfoByCode"] = sinon.stub().returns(authInfo)
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
