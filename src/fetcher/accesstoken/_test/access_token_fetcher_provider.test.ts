import test from "ava"
import * as sinon from "ts-sinon"
import {AccessTokenFetcher} from "../access_token_fetcher";
import {AccessTokenFetcherProvider} from "../access_token_fetcher_provider";
import {Request} from "../../../models/request";

test("AccessTokenFetcherProvider has fetchers", t => {
  const fetchers: AccessTokenFetcher[] = [
    sinon.stubInterface<AccessTokenFetcher>(),
    sinon.stubInterface<AccessTokenFetcher>()
  ]
  const subject = new AccessTokenFetcherProvider()

  subject.fetchers = fetchers
  t.is(subject.fetchers, fetchers)
})

test("AccessTokenFetcherProvider provides a fetcher by the request", t => {
  const subject = new AccessTokenFetcherProvider()

  const trueFetcher = sinon.stubInterface<AccessTokenFetcher>({match: true})
  const falseFetcher = sinon.stubInterface<AccessTokenFetcher>({match: false})
  const fetchers: AccessTokenFetcher[] = [trueFetcher, falseFetcher]
  subject.fetchers = fetchers

  t.is(subject.getfetcher(sinon.stubInterface<Request>()), trueFetcher)
})
