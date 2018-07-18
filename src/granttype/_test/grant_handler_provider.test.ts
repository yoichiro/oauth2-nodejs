import test from "ava"
import * as sinon from "ts-sinon"
import {GrantHandler} from "../grant_handler";
import {GrantHandlerProvider} from "../grant_handler_provider";

test("GrantHandlerProvider has GrantHandlers", t => {
  const grantHandler1 = sinon.stubInterface<GrantHandler>()
  const grantHandler2 = sinon.stubInterface<GrantHandler>()
  const handlers = new Map<string, GrantHandler>()
  handlers.set("grantHandler1", grantHandler1)
  handlers.set("grantHandler2", grantHandler2)

  const subject = new GrantHandlerProvider()
  subject.handlers = handlers
  t.is(subject.handlers, handlers)
})

test("GrantHandlerProvider has GrantHandlers passed after creating it", t => {
  const handlers1 = new Map<string, GrantHandler>()

  const subject = new GrantHandlerProvider()
  subject.handlers = handlers1
  t.is(subject.handlers, handlers1)

  const grantHandler1 = sinon.stubInterface<GrantHandler>()
  const grantHandler2 = sinon.stubInterface<GrantHandler>()
  const handlers2 = new Map<string, GrantHandler>()
  handlers2.set("grantHandler1", grantHandler1)
  handlers2.set("grantHandler2", grantHandler2)

  subject.handlers = handlers2
  t.is(subject.handlers, handlers2)
})

test("GrantHandlerProvider provides GrantHandler by the name", t => {
  const grantHandler1 = sinon.stubInterface<GrantHandler>()
  const grantHandler2 = sinon.stubInterface<GrantHandler>()
  const handlers = new Map<string, GrantHandler>()
  handlers.set("grantHandler1", grantHandler1)
  handlers.set("grantHandler2", grantHandler2)

  const subject = new GrantHandlerProvider()
  subject.handlers = handlers
  t.is(subject.getHandler("grantHandler1"), grantHandler1)
  t.is(subject.getHandler("grantHandler2"), grantHandler2)
})
