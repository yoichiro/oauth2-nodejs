import test from "ava"
import {
  AccessDenied, ExpiredToken, InsufficientScope,
  InvalidClient, InvalidGrant,
  InvalidRequest, InvalidScope, InvalidToken,
  OAuthError,
  RedirectUriMismatch,
  UnauthorizedClient, UnsupportedGrantType, UnsupportedResponseType
} from "../oauth_error";

class OAuthErrorMock extends OAuthError {

  getType(): string {
    return "type1";
  }

}

test("OAuthError has some properties", t => {
  const subject = new OAuthErrorMock(401, "description1")

  t.is(subject.code, 401)
  t.is(subject.description, "description1")
})

test("OAuthError provides the JSON string", t => {
  const subject = new OAuthErrorMock(401, "description1")

  t.is(subject.toJson(), "{\"error\":\"type1\",\"error_description\":\"description1\"}")
})

test("OAuthError provides the JSON string without description", t => {
  const subject = new OAuthErrorMock(401, "")

  t.is(subject.toJson(), "{\"error\":\"type1\"}")
})

test("InvalidRequest has some properties", t => {
  const subject = new InvalidRequest("description1")

  t.is(subject.code, 400)
  t.is(subject.description, "description1")
  t.is(subject.getType(), "invalid_request")
})

test("InvalidClient has some properties", t => {
  const subject = new InvalidClient("description1")

  t.is(subject.code, 401)
  t.is(subject.description, "description1")
  t.is(subject.getType(), "invalid_client")
})

test("UnauthorizedClient has some properties", t => {
  const subject = new UnauthorizedClient("description1")

  t.is(subject.code, 401)
  t.is(subject.description, "description1")
  t.is(subject.getType(), "unauthorized_client")
})

test("RedirectUriMismatch has some properties", t => {
  const subject = new RedirectUriMismatch("description1")

  t.is(subject.code, 401)
  t.is(subject.description, "description1")
  t.is(subject.getType(), "redirect_uri_mismatch")
})

test("AccessDenied has some properties", t => {
  const subject = new AccessDenied("description1")

  t.is(subject.code, 401)
  t.is(subject.description, "description1")
  t.is(subject.getType(), "access_denied")
})

test("UnsupportedResponseType has some properties", t => {
  const subject = new UnsupportedResponseType("description1")

  t.is(subject.code, 400)
  t.is(subject.description, "description1")
  t.is(subject.getType(), "unsupported_response_type")
})

test("InvalidGrant has some properties", t => {
  const subject = new InvalidGrant("description1")

  t.is(subject.code, 401)
  t.is(subject.description, "description1")
  t.is(subject.getType(), "invalid_grant")
})

test("UnsupportedGrantType has some properties", t => {
  const subject = new UnsupportedGrantType("description1")

  t.is(subject.code, 400)
  t.is(subject.description, "description1")
  t.is(subject.getType(), "unsupported_grant_type")
})

test("InvalidScope has some properties", t => {
  const subject = new InvalidScope("description1")

  t.is(subject.code, 401)
  t.is(subject.description, "description1")
  t.is(subject.getType(), "invalid_scope")
})

test("InvalidToken has some properties", t => {
  const subject = new InvalidToken("description1")

  t.is(subject.code, 401)
  t.is(subject.description, "description1")
  t.is(subject.getType(), "invalid_token")
})

test("ExpiredToken has some properties", t => {
  const subject = new ExpiredToken()

  t.is(subject.code, 401)
  t.is(subject.description, "The access token expired")
  t.is(subject.getType(), "invalid_token")
})

test("InsufficientScope has some properties", t => {
  const subject = new InsufficientScope("description1")

  t.is(subject.code, 401)
  t.is(subject.description, "description1")
  t.is(subject.getType(), "insufficient_scope")
})
