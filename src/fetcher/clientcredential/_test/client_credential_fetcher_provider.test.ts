import test from "ava"
import * as sinon from "ts-sinon"
import {ClientCredentialFetcher} from "../client_credential_fetcher";
import {ClientCredentialFetcherProvider} from "../client_credential_fetcher_provider";
import {Request} from "../../../models/request";

test("ClientCredentialFetcherProvider has fetchers", t => {
  const fetchers: ClientCredentialFetcher[] = [
    sinon.stubInterface<ClientCredentialFetcher>(),
    sinon.stubInterface<ClientCredentialFetcher>()
  ]
  const subject = new ClientCredentialFetcherProvider()

  subject.fetchers = fetchers
  t.is(subject.fetchers, fetchers)
})

test("ClientCredentialFetcherProvider provides a fetcher by the request", t => {
  const subject = new ClientCredentialFetcherProvider()

  const trueFetcher = sinon.stubInterface<ClientCredentialFetcher>({match: true})
  const falseFetcher = sinon.stubInterface<ClientCredentialFetcher>({match: false})
  const fetchers: ClientCredentialFetcher[] = [trueFetcher, falseFetcher]
  subject.fetchers = fetchers

  t.is(subject.getfetcher(sinon.stubInterface<Request>()), trueFetcher)
})
