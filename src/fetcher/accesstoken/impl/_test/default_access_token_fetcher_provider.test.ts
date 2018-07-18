import test from "ava"
import {DefaultAccessTokenFetcherProvider} from "../default_access_token_fetcher_provider";
import {AuthHeaderAccessTokenFetcher} from "../auth_header_access_token_fetcher";
import {RequestParameterAccessTokenFetcher} from "../request_parameter_access_token_fetcher";

test("DefaultAccessTokenFetcherProvider provides two fetchers", t => {
  const subject = new DefaultAccessTokenFetcherProvider()
  const fetchers = subject.fetchers
  t.is(fetchers[0] instanceof AuthHeaderAccessTokenFetcher, true)
  t.is(fetchers[1] instanceof RequestParameterAccessTokenFetcher, true)
})
