import test from "ava"
import {GrantHandlerResult} from "../grant_handler";

test("GrantHandlerResult has some properties", t => {
  const subject = new GrantHandlerResult("tokenType1", "accessToken1")

  t.is(subject.tokenType, "tokenType1")
  t.is(subject.accessToken, "accessToken1")

  subject.expiresIn = 123
  t.is(subject.expiresIn, 123)

  subject.refreshToken = "refreshToken1"
  t.is(subject.refreshToken, "refreshToken1")

  subject.scope = "scope1"
  t.is(subject.scope, "scope1")
})

test("GrantHandlerResult provides the JSON string", t => {
  const subject = new GrantHandlerResult("tokenType1", "accessToken1")
  subject.refreshToken = "refreshToken1"
  subject.expiresIn = 123

  t.is(subject.toJson(), "{\"token_type\":\"tokenType1\",\"access_token\":\"accessToken1\",\"expires_in\":123,\"refresh_token\":\"refreshToken1\"}")
})
