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

test("AuthInfo has some additional info", t => {
  const subject = new AuthInfo()

  subject.setAdditionalInfo("name1", "value1")
  t.is(subject.getAdditionalInfo("name1"), "value1")
  subject.deleteAdditionalInfo("name1")
  t.is(subject.getAdditionalInfo("name1"), undefined)

  subject.setAdditionalInfo("name1", "value1")
  subject.setAdditionalInfo("name2", "value2")
  t.is(subject.getAdditionalInfoNames()[0], "name1")
  t.is(subject.getAdditionalInfoNames()[1], "name2")
})
