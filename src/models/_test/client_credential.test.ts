import test from "ava"
import {ClientCredential} from "../client_credential";

test("ClientCredential can have clientId and clientSecret values", t => {
  const subject = new ClientCredential("clientId1", "clientSecret1")
  t.is(subject.clientId, "clientId1")
  t.is(subject.clientSecret, "clientSecret1")
})
