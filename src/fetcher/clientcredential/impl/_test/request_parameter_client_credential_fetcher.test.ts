import test from "ava"
import * as sinon from "sinon"
import {stubInterface} from "ts-sinon";
import {Request} from "../../../../models/request";
import {RequestParameterClientCredentialFetcher} from "../request_parameter_client_credential_fetcher";

const createRequestMockWith2Args = (clientId?: string, clientSecret?: string): Request => {
  const stub = stubInterface<Request>()
  const func = sinon.stub()
  func.withArgs("client_id").returns(clientId)
  func.withArgs("client_secret").returns(clientSecret)
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

test("RequestParameterClientCredentialFetcher#match decides whether the request is matched or not against the passed request", t => {
  const subject = new RequestParameterClientCredentialFetcher()

  t.is(subject.match(createRequestMockWith2Args(undefined, undefined)), false)
  t.is(subject.match(createRequestMockWith2Args("clientId1", undefined)), false)
  t.is(subject.match(createRequestMockWith2Args(undefined, "clientSecret1")), false)
  t.is(subject.match(createRequestMockWith2Args("clientId1", "clientSecret1")), true)
})

test("RequestParameterClientCredentialFetcher#fetch fetches parameters from the request", t => {
  const subject = new RequestParameterClientCredentialFetcher()
  const request = createRequestMockWithParams({
    "client_id": "client_id_value",
    "client_secret": "client_secret_value",
  })
  const actual = subject.fetch(request)
  t.is(actual.clientId, "client_id_value")
  t.is(actual.clientSecret, "client_secret_value")
})

test("RequestParameterClientCredentialFetcher#fetch fetches parameters from the request without client_secret", t => {
  const subject = new RequestParameterClientCredentialFetcher()
  const request = createRequestMockWithParams({
    "client_id": "client_id_value"
  })
  try {
    subject.fetch(request)
    t.fail()
  } catch(e) {
    t.pass()
  }
})

test("RequestParameterClientCredentialFetcher#fetch fetches parameters from the request without client_id", t => {
  const subject = new RequestParameterClientCredentialFetcher()
  const request = createRequestMockWithParams({
    "client_secret": "client_secret_value"
  })
  try {
    subject.fetch(request)
    t.fail()
  } catch(e) {
    t.pass()
  }
})
