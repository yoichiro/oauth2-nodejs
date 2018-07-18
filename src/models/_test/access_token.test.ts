import test from "ava"
import {AccessToken} from "../access_token";

test("AccessToken has some properties", t => {
  const subject = new AccessToken()

  subject.authId = "authId1"
  t.is(subject.authId, "authId1")

  subject.createdOn = 123
  t.is(subject.createdOn, 123)

  subject.expiresIn = 456
  t.is(subject.expiresIn, 456)

  subject.token = "token1"
  t.is(subject.token, "token1")
})
