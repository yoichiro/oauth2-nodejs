import test from "ava"
import * as sinon from "sinon"
import {stubInterface} from "ts-sinon"
import {Request} from "../../../../models/request";
import {AuthHeaderClientCredentialFetcher} from "../auth_header_client_credential_fetcher";

const createRequestMock = (authorization?: string): Request => {
  const request = stubInterface<Request>()
  const func = sinon.stub()
  func.withArgs("Authorization").returns(authorization)
  request["getHeader"] = func
  return request
}

test("AuthHeaderClientCredentialFetcher#match decides whether the passed request is matched or not", t => {
  const subject = new AuthHeaderClientCredentialFetcher()

  t.is(subject.match(createRequestMock(undefined)), false)
  t.is(subject.match(createRequestMock("Basic Y2xpZW50X2lkX3ZhbHVlOmNsaWVudF9zZWNyZXRfdmFsdWU=")), true)
  t.is(subject.match(createRequestMock("Basic abc")), false)
  t.is(subject.match(createRequestMock("Basic")), false)
  t.is(subject.match(createRequestMock(" Basic Y2xpZW50X2lkX3ZhbHVlOmNsaWVudF9zZWNyZXRfdmFsdWU=")), true)
  t.is(subject.match(createRequestMock(" Basic abc")), false)
  t.is(subject.match(createRequestMock("Basi Y2xpZW50X2lkX3ZhbHVlOmNsaWVudF9zZWNyZXRfdmFsdWU=")), false)
  t.is(subject.match(createRequestMock("basic Y2xpZW50X2lkX3ZhbHVlOmNsaWVudF9zZWNyZXRfdmFsdWU=")), false)
})

test("AuthHeaderClientCredentialFetcher#fetch fetches a client credential from the request header with valid string", t => {
  const subject = new AuthHeaderClientCredentialFetcher()
  const request = createRequestMock("Basic Y2xpZW50X2lkX3ZhbHVlOmNsaWVudF9zZWNyZXRfdmFsdWU=")
  const actual = subject.fetch(request)
  t.is(actual.clientId, "client_id_value")
  t.is(actual.clientSecret, "client_secret_value")
})

test("AuthHeaderClientCredentialFetcher#fetch doesn't fetch a client credential from the request header with invalid Basic string", t => {
  const subject = new AuthHeaderClientCredentialFetcher()
  const request = createRequestMock("Basic evil")
  try {
    subject.fetch(request)
    t.fail()
  } catch(e) {
    t.pass()
  }
})

test("AuthHeaderClientCredentialFetcher#fetch doesn't fetch a client credential from the request header with invalid string", t => {
  const subject = new AuthHeaderClientCredentialFetcher()
  const request = createRequestMock("evil")
  try {
    subject.fetch(request)
    t.fail()
  } catch(e) {
    t.pass()
  }
})

test("AuthHeaderClientCredentialFetcher#fetch doesn't fetch a client credential from the request header with invalid params", t => {
  const subject = new AuthHeaderClientCredentialFetcher()
  const request = createRequestMock("Basic ZXZpbA==")
  try {
    subject.fetch(request)
    t.fail()
  } catch(e) {
    t.pass()
  }
})
