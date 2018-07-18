import test from "ava"
import {FetchResult} from "../access_token_fetcher";

test("FetcherResult is created with arguments", t => {
  const token = "token1"
  const params = new Map<string, string>()
  const subject = new FetchResult(token, params)

  t.is(subject.token, token)
  t.is(subject.params, params)
})
