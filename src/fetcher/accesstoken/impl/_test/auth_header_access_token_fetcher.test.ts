import test from "ava"
import * as sinon from "sinon"
import {stubInterface} from "ts-sinon"
import {AuthHeaderAccessTokenFetcher} from "../auth_header_access_token_fetcher";
import {Request} from "../../../../models/request";

const createRequestMock = (authorization?: string): Request => {
  const request = stubInterface<Request>()
  const func = sinon.stub()
  func.withArgs("Authorization").returns(authorization)
  request["getHeader"] = func
  return request
}

test("AuthHeaderAccessTokenFetcher#match decides whether the passed request is matched or not", t => {
  const subject = new AuthHeaderAccessTokenFetcher()

  t.is(subject.match(createRequestMock(undefined)), false)
  t.is(subject.match(createRequestMock("OAuth token1")), true)
  t.is(subject.match(createRequestMock("OAuth")), true)
  t.is(subject.match(createRequestMock(" OAuth token1")), true)
  t.is(subject.match(createRequestMock("OAut token1")), false)
  t.is(subject.match(createRequestMock("oaut token1")), false)
  t.is(subject.match(createRequestMock("Bearer token1")), true)
  t.is(subject.match(createRequestMock("Bearer")), true)
  t.is(subject.match(createRequestMock(" Bearer token1")), true)
  t.is(subject.match(createRequestMock("Beare token1")), false)
  t.is(subject.match(createRequestMock("bearer token1")), false)
})

test("AuthHeaderAccessTokenFetcher#fetch fetches an access token from the request with Bearer token", t => {
  const subject = new AuthHeaderAccessTokenFetcher()
  const request = createRequestMock("Bearer access_token_value")
  const actual = subject.fetch(request)
  t.is(actual.token, "access_token_value")
  t.is(actual.params.size, 0)
})

test("AuthHeaderAccessTokenFetcher#fetch fetches an access token from the request with OAuth token", t => {
  const subject = new AuthHeaderAccessTokenFetcher()
  const request = createRequestMock("OAuth access_token_value")
  const actual = subject.fetch(request)
  t.is(actual.token, "access_token_value")
  t.is(actual.params.size, 0)
})

test("AuthHeaderAccessTokenFetcher#fetch doesn't fetch an access token from the evil request", t => {
  const subject = new AuthHeaderAccessTokenFetcher()
  const request = createRequestMock("evil")
  try {
    subject.fetch(request)
    t.fail()
  } catch(e) {
    t.pass()
  }
})

test("AuthHeaderAccessTokenFetcher#fetch doesn't fetch an access token from the request which has an invalid format", t => {
  const subject = new AuthHeaderAccessTokenFetcher()
  const request = createRequestMock("OAuth access_token_value ")
  try {
    subject.fetch(request)
    t.fail()
  } catch(e) {
    t.pass()
  }
})

test("AuthHeaderAccessTokenFetcher#fetch fetches an access token from the request with Bearer token with parameters", t => {
  const subject = new AuthHeaderAccessTokenFetcher()
  const request = createRequestMock(
    "Bearer access_token_value, "
    + "algorithm=\"hmac-sha256\", "
    + "nonce=\"s8djwd\", "
    + "signature=\"wOJIO9A2W5mFwDgiDvZbTSMK%2FPY%3D\", "
    + "timestamp=\"137131200\""
  )
  const actual = subject.fetch(request)
  t.is(actual.token, "access_token_value")
  t.is(actual.params.size, 4)
  t.is(actual.params.get("algorithm"), "hmac-sha256")
  t.is(actual.params.get("nonce"), "s8djwd")
  t.is(actual.params.get("signature"), "wOJIO9A2W5mFwDgiDvZbTSMK%2FPY%3D")
  t.is(actual.params.get("timestamp"), "137131200")
})

test("AuthHeaderAccessTokenFetcher#fetch fetches an access token from the request with OAuth token with parameters", t => {
  const subject = new AuthHeaderAccessTokenFetcher()
  const request = createRequestMock(
    "OAuth access_token_value, "
    + "algorithm=\"hmac-sha256\", "
    + "nonce=\"s8djwd\", "
    + "signature=\"wOJIO9A2W5mFwDgiDvZbTSMK%2FPY%3D\", "
    + "timestamp=\"137131200\""
  )
  const actual = subject.fetch(request)
  t.is(actual.token, "access_token_value")
  t.is(actual.params.size, 4)
  t.is(actual.params.get("algorithm"), "hmac-sha256")
  t.is(actual.params.get("nonce"), "s8djwd")
  t.is(actual.params.get("signature"), "wOJIO9A2W5mFwDgiDvZbTSMK%2FPY%3D")
  t.is(actual.params.get("timestamp"), "137131200")
})
