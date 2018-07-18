import test from "ava"
import {DefaultClientCredentialFetcherProvider} from "../default_client_credential_fetcher_provider";
import {AuthHeaderClientCredentialFetcher} from "../auth_header_client_credential_fetcher";
import {RequestParameterClientCredentialFetcher} from "../request_parameter_client_credential_fetcher";

test("DefaultClientCredentialFetcherProvider provides two fetchers", t => {
  const subject = new DefaultClientCredentialFetcherProvider()
  const fetchers = subject.fetchers
  t.is(fetchers[0] instanceof AuthHeaderClientCredentialFetcher, true)
  t.is(fetchers[1] instanceof RequestParameterClientCredentialFetcher, true)
})
