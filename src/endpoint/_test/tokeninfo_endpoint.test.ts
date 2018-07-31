import test from "ava";
import * as sinon from "sinon"
import {TokeninfoEndpoint, TokeninfoEndpointResponse} from "../tokeninfo_endpoint";
import {stubInterface} from "ts-sinon";
import {AccessToken, AuthInfo, Request} from "../../models";
import {DataHandler, DataHandlerFactory} from "../../data";

test("TokeninfoEndpointResponse has some properties", t => {
  const subject = new TokeninfoEndpointResponse(123, "body1")

  t.is(subject.code, 123)
  t.is(subject.body, "body1")
})

const createRequestMock = (params: {[key: string]: string}): Request => {
  const stub = stubInterface<Request>()
  const funcParams = sinon.stub()
  const parameterMap = new Map<string, string>()
  Object.keys(params).forEach(key => {
    funcParams.withArgs(key).returns(params[key])
    parameterMap.set(key, params[key])
  })
  stub["getParameter"] = funcParams
  stub["getParameterMap"] = sinon.stub().returns(parameterMap)
  return stub
}

test("TokeninfoEndpoint returns an error response when access_token not found", async t => {
  const request = createRequestMock({})
  const subject = new TokeninfoEndpoint()

  const response = await subject.handleRequest(request)

  t.is(response.code, 400)
  t.is(response.body, "{\"error\":\"invalid_request\",\"error_description\":\"access_token not found\"}")
})

test("TokeninfoEndpoint returns an error response when access_token is empty", async t => {
  const request = createRequestMock({
    "access_token": ""
  })
  const subject = new TokeninfoEndpoint()

  const response = await subject.handleRequest(request)

  t.is(response.code, 400)
  t.is(response.body, "{\"error\":\"invalid_request\",\"error_description\":\"access_token not found\"}")
})

test("TokeninfoEndpoint returns an error response when access_token not found in DB", async t => {
  const request = createRequestMock({
    "access_token": "accessToken1"
  })
  const subject = new TokeninfoEndpoint()
  const dataHandler = stubInterface<DataHandler>()
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    "create": dataHandler
  })
  subject.dataHandlerFactory = dataHandlerFactory

  const response = await subject.handleRequest(request)

  t.is(response.code, 401)
  t.is(response.body, "{\"error\":\"invalid_token\"}")
})

test("TokeninfoEndpoint returns an error response when auth_info not found in DB", async t => {
  const request = createRequestMock({
    "access_token": "accessToken1"
  })
  const subject = new TokeninfoEndpoint()
  const accessToken = new AccessToken()
  const dataHandler = stubInterface<DataHandler>({
    "getAccessToken": accessToken
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    "create": dataHandler
  })
  subject.dataHandlerFactory = dataHandlerFactory

  const response = await subject.handleRequest(request)

  t.is(response.code, 401)
  t.is(response.body, "{\"error\":\"invalid_token\"}")
})

test("TokeninfoEndpoint returns a success response", async t => {
  const request = createRequestMock({
    "access_token": "accessToken1"
  })
  const subject = new TokeninfoEndpoint()
  const accessToken = new AccessToken()
  accessToken.expiresIn = 123
  const authInfo = new AuthInfo()
  authInfo.scope = "scope1"
  authInfo.userId = "userId1"
  authInfo.clientId = "clientId1"
  const dataHandler = stubInterface<DataHandler>({
    "getAccessToken": accessToken,
    "getAuthInfoById": authInfo
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    "create": dataHandler
  })
  subject.dataHandlerFactory = dataHandlerFactory

  const response = await subject.handleRequest(request)

  t.is(response.code, 200)
  t.is(response.body, "{\"aud\":\"clientId1\",\"sub\":\"userId1\",\"scope\":\"scope1\",\"expires_in\":\"123\"}")
})
