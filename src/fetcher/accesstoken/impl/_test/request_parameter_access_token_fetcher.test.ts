import test from "ava"
import {stubInterface} from "ts-sinon"
import * as sinon from "sinon"
import {RequestParameterAccessTokenFetcher} from "../request_parameter_access_token_fetcher";
import {Request} from "../../../../models/request";

const createRequestMockWith2Args = (oauthToken?: string, accessToken?: string): Request => {
  const stub = stubInterface<Request>()
  const func = sinon.stub()
  func.withArgs("oauth_token").returns(oauthToken)
  func.withArgs("access_token").returns(accessToken)
  stub["getParameter"] = func
  return stub
}

const createRequestMockWithParams = (params: {[key: string]: string}): Request => {
  const stub = stubInterface<Request>()
  const func = sinon.stub()
  const parameterMap = new Map<string, string>()
  Object.keys(params).forEach(key => {
    func.withArgs(key).returns(params[key])
    parameterMap.set(key, params[key])
  })
  stub["getParameter"] = func
  stub["getParameterMap"] = sinon.stub().returns(parameterMap)
  return stub
}

test("RequestParameterAccessTokenFetcher#match decides whether the request is matched or not against the passed request", t => {
  const subject = new RequestParameterAccessTokenFetcher()

  t.is(subject.match(createRequestMockWith2Args(undefined, undefined)), false)
  t.is(subject.match(createRequestMockWith2Args("token1", undefined)), true)
  t.is(subject.match(createRequestMockWith2Args(undefined, "token1")), true)
  t.is(subject.match(createRequestMockWith2Args("token1", "token2")), true)
})

test("RequestParameterAccessTokenFetcher#fetch fetches parameters from the request with oauth_token parameter", t => {
  const subject = new RequestParameterAccessTokenFetcher()
  const request = createRequestMockWithParams({
    "oauth_token": "access_token_value"
  })
  const actual = subject.fetch(request)
  t.is(actual.token, "access_token_value")
  t.is(actual.params.size, 0)
})

test("RequestParameterAccessTokenFetcher#fetch fetches parameters from the request with access_token parameter", t => {
  const subject = new RequestParameterAccessTokenFetcher()
  const request = createRequestMockWithParams({
    "access_token": "access_token_value"
  })
  const actual = subject.fetch(request)
  t.is(actual.token, "access_token_value")
  t.is(actual.params.size, 0)
})

test("RequestParameterAccessTokenFetcher#fetch fetches parameters from the request with access_token and other parameters", t => {
  const subject = new RequestParameterAccessTokenFetcher()
  const request = createRequestMockWithParams({
    "access_token": "access_token_value",
    "foo": "bar"
  })
  const actual = subject.fetch(request)
  t.is(actual.token, "access_token_value")
  t.is(actual.params.size, 1)
  t.is(actual.params.get("foo"), "bar")
})

test("RequestParameterAccessTokenFetcher#fetch fetches parameters from the request with evil parameter", t => {
  const subject = new RequestParameterAccessTokenFetcher()
  const request = createRequestMockWithParams({
    "evil": "foobar"
  })
  try {
    subject.fetch(request)
    t.fail()
  } catch(e) {
    t.pass()
  }
})
