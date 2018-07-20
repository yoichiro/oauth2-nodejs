import test from "ava";
import {stubInterface} from "ts-sinon";
import * as sinon from "sinon";
import {AccessToken, AuthInfo, Request} from "../../models";
import {DataHandler, DataHandlerFactory} from "../../data";
import {AuthorizationEndpoint, AuthorizationEndpointResponse} from "../authorization_endpoint";
import {InvalidClient, InvalidRequest, UnknownError} from "../../exceptions";

test("AuthorizationEndpointResponse has some properties", t => {
  const subject = new AuthorizationEndpointResponse()
  subject.redirectUri = "redirectUri1"
  subject.query = {"key1": "value2", "key2": 123}
  subject.fragment = {"key3": "value3", "key4": 456}

  t.is(subject.redirectUri, "redirectUri1")
  t.deepEqual(subject.query, {"key1": "value2", "key2": 123})
  t.deepEqual(subject.fragment, {"key3": "value3", "key4": 456})
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

test("AuthorizationEndpoint#handleRequest returns error result when response_type not found", async t => {
  const request = createRequestMock({}, {})

  const dataHandlerFactory = stubInterface<DataHandlerFactory>()
  const allowedResponseTypes: string[] = []

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory
  subject.allowedResponseTypes = allowedResponseTypes

  const result = await subject.handleRequest(request)

  t.is(result.isError(), true)
  t.is(result.error instanceof InvalidRequest, true)
})

test("AuthorizationEndpoint#handleRequest returns error result when response_type not allowed", async t => {
  const request = createRequestMock({
    "response_type": "evil"
  }, {})

  const dataHandlerFactory = stubInterface<DataHandlerFactory>()
  const allowedResponseTypes: string[] = ["responseType1"]

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory
  subject.allowedResponseTypes = allowedResponseTypes

  const result = await subject.handleRequest(request)

  t.is(result.isError(), true)
  t.is(result.error instanceof InvalidRequest, true)
})

test("AuthorizationEndpoint#handleRequest returns error result when client_id not found", async t => {
  const request = createRequestMock({
    "response_type": "responseType1"
  }, {})

  const dataHandlerFactory = stubInterface<DataHandlerFactory>()
  const allowedResponseTypes: string[] = ["responseType1"]

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory
  subject.allowedResponseTypes = allowedResponseTypes

  const result = await subject.handleRequest(request)

  t.is(result.isError(), true)
  t.is(result.error instanceof InvalidRequest, true)
})

test("AuthorizationEndpoint#handleRequest returns error result when client not found", async t => {
  const request = createRequestMock({
    "response_type": "responseType1",
    "client_id": "evil"
  }, {})

  const dataHandler = stubInterface<DataHandler>({
    getRequest: request,
    validateClientById: false
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })
  const allowedResponseTypes: string[] = ["responseType1"]

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory
  subject.allowedResponseTypes = allowedResponseTypes

  const result = await subject.handleRequest(request)

  t.is(result.isError(), true)
  t.is(result.error instanceof InvalidClient, true)
})

test("AuthorizationEndpoint#handleRequest returns error result when client is invalid", async t => {
  const request = createRequestMock({
    "response_type": "responseType1",
    "client_id": "clientId1"
  }, {})

  const dataHandler = stubInterface<DataHandler>({
    getRequest: request,
    validateClientById: true,
    validateClientForAuthorization: false
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })
  const allowedResponseTypes: string[] = ["responseType1"]

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory
  subject.allowedResponseTypes = allowedResponseTypes

  const result = await subject.handleRequest(request)

  t.is(result.isError(), true)
  t.is(result.error instanceof InvalidClient, true)
})

test("AuthorizationEndpoint#handleRequest returns error result when redirect_uri not found", async t => {
  const request = createRequestMock({
    "response_type": "responseType1",
    "client_id": "clientId1"
  }, {})

  const dataHandler = stubInterface<DataHandler>({
    getRequest: request,
    validateClientById: true,
    validateClientForAuthorization: true
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })
  const allowedResponseTypes: string[] = ["responseType1"]

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory
  subject.allowedResponseTypes = allowedResponseTypes

  const result = await subject.handleRequest(request)

  t.is(result.isError(), true)
  t.is(result.error instanceof InvalidRequest, true)
})

test("AuthorizationEndpoint#handleRequest returns error result when redirect_uri is invalid", async t => {
  const request = createRequestMock({
    "response_type": "responseType1",
    "client_id": "clientId1",
    "redirect_uri": "evil"
  }, {})

  const dataHandler = stubInterface<DataHandler>({
    getRequest: request,
    validateClientById: true,
    validateClientForAuthorization: true,
    validateRedirectUri: false
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })
  const allowedResponseTypes: string[] = ["responseType1"]

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory
  subject.allowedResponseTypes = allowedResponseTypes

  const result = await subject.handleRequest(request)

  t.is(result.isError(), true)
  t.is(result.error instanceof InvalidClient, true)
})

test("AuthorizationEndpoint#handleRequest returns success result", async t => {
  const request = createRequestMock({
    "response_type": "responseType1",
    "client_id": "clientId1",
    "redirect_uri": "redirectUri1"
  }, {})

  const dataHandler = stubInterface<DataHandler>({
    getRequest: request,
    validateClientById: true,
    validateClientForAuthorization: true,
    validateRedirectUri: true
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })
  const allowedResponseTypes: string[] = ["responseType1"]

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory
  subject.allowedResponseTypes = allowedResponseTypes

  const result = await subject.handleRequest(request)

  t.is(result.isSuccess(), true)
})

test("AuthorizationEndpoint#allow returns error response when response_type not found", async t => {
  const request = createRequestMock({}, {})

  const dataHandler = stubInterface<DataHandler>()
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory

  const result = await subject.allow(request)

  t.is(result.isError(), true)
  t.is(result.error instanceof InvalidRequest, true)
})

test("AuthorizationEndpoint#allow returns error response when client_id not found", async t => {
  const request = createRequestMock({
    "response_type": "responseType1"
  }, {})

  const dataHandler = stubInterface<DataHandler>()
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory

  const result = await subject.allow(request)

  t.is(result.isError(), true)
  t.is(result.error instanceof InvalidRequest, true)
})

test("AuthorizationEndpoint#allow returns error response when user_id not found", async t => {
  const request = createRequestMock({
    "response_type": "responseType1",
    "client_id": "clientId1"
  }, {})

  const dataHandler = stubInterface<DataHandler>()
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory

  const result = await subject.allow(request)

  t.is(result.isError(), true)
  t.is(result.error instanceof InvalidRequest, true)
})

test("AuthorizationEndpoint#allow returns error response when redirect_uri not found", async t => {
  const request = createRequestMock({
    "response_type": "responseType1",
    "client_id": "clientId1",
    "user_id": "userId1"
  }, {})

  const dataHandler = stubInterface<DataHandler>()
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory

  const result = await subject.allow(request)

  t.is(result.isError(), true)
  t.is(result.error instanceof InvalidRequest, true)
})

test("AuthorizationEndpoint#allow returns error response when authInfo not found", async t => {
  const request = createRequestMock({
    "response_type": "responseType1",
    "client_id": "clientId1",
    "user_id": "userId1",
    "redirect_uri": "redirectUri1"
  }, {})

  const dataHandler = stubInterface<DataHandler>()
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory

  const result = await subject.allow(request)

  t.is(result.isError(), true)
  t.is(result.error instanceof InvalidClient, true)
})

test("AuthorizationEndpoint#allow returns error response when accessToken not found", async t => {
  const request = createRequestMock({
    "response_type": "token",
    "client_id": "clientId1",
    "user_id": "userId1",
    "redirect_uri": "redirectUri1"
  }, {})

  const authInfo = new AuthInfo()
  const dataHandler = stubInterface<DataHandler>({
    createOrUpdateAuthInfo: authInfo
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory

  const result = await subject.allow(request)

  t.is(result.isError(), true)
  t.is(result.error instanceof UnknownError, true)
})

test("AuthorizationEndpoint#allow returns success response with token", async t => {
  const request = createRequestMock({
    "response_type": "token",
    "client_id": "clientId1",
    "user_id": "userId1",
    "redirect_uri": "redirectUri1"
  }, {})

  const authInfo = new AuthInfo()
  const accessToken = new AccessToken()
  accessToken.token = "token1"
  accessToken.expiresIn = 123
  const dataHandler = stubInterface<DataHandler>({
    createOrUpdateAuthInfo: authInfo,
    createOrUpdateAccessToken: accessToken
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory

  const result = await subject.allow(request)

  t.is(result.isSuccess(), true)
  const response = result.value
  t.is(response.redirectUri, "redirectUri1")
  t.is(response.fragment!["access_token"], "token1")
  t.is(response.fragment!["token_type"], "Bearer")
  t.is(response.fragment!["expires_in"], 123)
})

test("AuthorizationEndpoint#allow returns success response with token, state", async t => {
  const request = createRequestMock({
    "response_type": "token",
    "client_id": "clientId1",
    "user_id": "userId1",
    "redirect_uri": "redirectUri1",
    "state": "state1"
  }, {})

  const authInfo = new AuthInfo()
  const accessToken = new AccessToken()
  accessToken.token = "token1"
  accessToken.expiresIn = 123
  const dataHandler = stubInterface<DataHandler>({
    createOrUpdateAuthInfo: authInfo,
    createOrUpdateAccessToken: accessToken
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory

  const result = await subject.allow(request)

  t.is(result.isSuccess(), true)
  const response = result.value
  t.is(response.redirectUri, "redirectUri1")
  t.is(response.fragment!["access_token"], "token1")
  t.is(response.fragment!["token_type"], "Bearer")
  t.is(response.fragment!["expires_in"], 123)
  t.is(response.fragment!["state"], "state1")
})

test("AuthorizationEndpoint#allow returns success response with code", async t => {
  const request = createRequestMock({
    "response_type": "code",
    "client_id": "clientId1",
    "user_id": "userId1",
    "redirect_uri": "redirectUri1"
  }, {})

  const authInfo = new AuthInfo()
  authInfo.code = "code1"
  const dataHandler = stubInterface<DataHandler>({
    createOrUpdateAuthInfo: authInfo
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory

  const result = await subject.allow(request)

  t.is(result.isSuccess(), true)
  const response = result.value
  t.is(response.redirectUri, "redirectUri1")
  t.is(response.query!["code"], "code1")
})

test("AuthorizationEndpoint#allow returns success response with code, state", async t => {
  const request = createRequestMock({
    "response_type": "code",
    "client_id": "clientId1",
    "user_id": "userId1",
    "redirect_uri": "redirectUri1",
    "state": "state1"
  }, {})

  const authInfo = new AuthInfo()
  authInfo.code = "code1"
  const dataHandler = stubInterface<DataHandler>({
    createOrUpdateAuthInfo: authInfo
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory

  const result = await subject.allow(request)

  t.is(result.isSuccess(), true)
  const response = result.value
  t.is(response.redirectUri, "redirectUri1")
  t.is(response.query!["code"], "code1")
  t.is(response.query!["state"], "state1")
})

test("AuthorizationEndpoint#allow returns success response with code, token", async t => {
  const request = createRequestMock({
    "response_type": "token code",
    "client_id": "clientId1",
    "user_id": "userId1",
    "redirect_uri": "redirectUri1"
  }, {})

  const authInfo = new AuthInfo()
  authInfo.code = "code1"
  const accessToken = new AccessToken()
  accessToken.token = "token1"
  accessToken.expiresIn = 123
  const dataHandler = stubInterface<DataHandler>({
    createOrUpdateAuthInfo: authInfo,
    createOrUpdateAccessToken: accessToken
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory

  const result = await subject.allow(request)

  t.is(result.isSuccess(), true)
  const response = result.value
  t.is(response.redirectUri, "redirectUri1")
  t.is(response.fragment!["access_token"], "token1")
  t.is(response.fragment!["token_type"], "Bearer")
  t.is(response.fragment!["expires_in"], 123)
  t.is(response.fragment!["code"], "code1")
})

test("AuthorizationEndpoint#allow returns success response with code, token, state", async t => {
  const request = createRequestMock({
    "response_type": "token code",
    "client_id": "clientId1",
    "user_id": "userId1",
    "redirect_uri": "redirectUri1",
    "state": "state1"
  }, {})

  const authInfo = new AuthInfo()
  authInfo.code = "code1"
  const accessToken = new AccessToken()
  accessToken.token = "token1"
  accessToken.expiresIn = 123
  const dataHandler = stubInterface<DataHandler>({
    createOrUpdateAuthInfo: authInfo,
    createOrUpdateAccessToken: accessToken
  })
  const dataHandlerFactory = stubInterface<DataHandlerFactory>({
    create: dataHandler
  })

  const subject = new AuthorizationEndpoint()
  subject.dataHandlerFactory = dataHandlerFactory

  const result = await subject.allow(request)

  t.is(result.isSuccess(), true)
  const response = result.value
  t.is(response.redirectUri, "redirectUri1")
  t.is(response.fragment!["access_token"], "token1")
  t.is(response.fragment!["token_type"], "Bearer")
  t.is(response.fragment!["expires_in"], 123)
  t.is(response.fragment!["code"], "code1")
  t.is(response.fragment!["state"], "state1")
})

test("AuthorizationEndpoint#deny returns error response when response_type not found", async t => {
  const request = createRequestMock({}, {})

  const subject = new AuthorizationEndpoint()

  const result = await subject.deny(request)

  t.is(result.isError(), true)
  t.is(result.error instanceof InvalidRequest, true)
})

test("AuthorizationEndpoint#deny returns error response when redirect_uri not found", async t => {
  const request = createRequestMock({
    "response_type": "responseType1"
  }, {})

  const subject = new AuthorizationEndpoint()

  const result = await subject.deny(request)

  t.is(result.isError(), true)
  t.is(result.error instanceof InvalidRequest, true)
})

test("AuthorizationEndpoint#deny returns success response with code", async t => {
  const request = createRequestMock({
    "response_type": "code",
    "redirect_uri": "redirectUri1"
  }, {})

  const subject = new AuthorizationEndpoint()

  const result = await subject.deny(request)

  t.is(result.isSuccess(), true)
  const response = result.value
  t.is(response.redirectUri, "redirectUri1")
  t.is(response.query!["error"], "access_denied")
})

test("AuthorizationEndpoint#deny returns success response with code, state", async t => {
  const request = createRequestMock({
    "response_type": "code",
    "redirect_uri": "redirectUri1",
    "state": "state1"
  }, {})

  const subject = new AuthorizationEndpoint()

  const result = await subject.deny(request)

  t.is(result.isSuccess(), true)
  const response = result.value
  t.is(response.redirectUri, "redirectUri1")
  t.is(response.query!["error"], "access_denied")
  t.is(response.query!["state"], "state1")
})

test("AuthorizationEndpoint#deny returns success response with token", async t => {
  const request = createRequestMock({
    "response_type": "token",
    "redirect_uri": "redirectUri1"
  }, {})

  const subject = new AuthorizationEndpoint()

  const result = await subject.deny(request)

  t.is(result.isSuccess(), true)
  const response = result.value
  t.is(response.redirectUri, "redirectUri1")
  t.is(response.fragment!["error"], "access_denied")
})

test("AuthorizationEndpoint#deny returns success response with token, state", async t => {
  const request = createRequestMock({
    "response_type": "token",
    "redirect_uri": "redirectUri1",
    "state": "state1"
  }, {})

  const subject = new AuthorizationEndpoint()

  const result = await subject.deny(request)

  t.is(result.isSuccess(), true)
  const response = result.value
  t.is(response.redirectUri, "redirectUri1")
  t.is(response.fragment!["error"], "access_denied")
  t.is(response.fragment!["state"], "state1")
})

test("AuthorizationEndpoint#deny returns success response with code, token, state", async t => {
  const request = createRequestMock({
    "response_type": "code token",
    "redirect_uri": "redirectUri1",
    "state": "state1"
  }, {})

  const subject = new AuthorizationEndpoint()

  const result = await subject.deny(request)

  t.is(result.isSuccess(), true)
  const response = result.value
  t.is(response.redirectUri, "redirectUri1")
  t.is(response.fragment!["error"], "access_denied")
  t.is(response.fragment!["state"], "state1")
})
