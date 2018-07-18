import test from "ava"
import {AuthInfo} from "../auth_info";

test("AuthInfo has some properties", t => {
  const subject = new AuthInfo()

  subject.clientId = "clientId1"
  t.is(subject.clientId, "clientId1")

  subject.code = "code1"
  t.is(subject.code, "code1")

  subject.id = "id1"
  t.is(subject.id, "id1")

  subject.redirectUri = "redirectUri1"
  t.is(subject.redirectUri, "redirectUri1")

  subject.refreshToken = "refreshToken1"
  t.is(subject.refreshToken, "refreshToken1")

  subject.userId = "userId1"
  t.is(subject.userId, "userId1")

  subject.scope = "scope1"
  t.is(subject.scope, "scope1")
})
