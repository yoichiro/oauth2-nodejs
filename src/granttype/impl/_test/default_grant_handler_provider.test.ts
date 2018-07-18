import test from "ava";
import {stubInterface} from "ts-sinon";
import {DefaultGrantHandlerProvider} from "../default_grant_handler_provider";
import {ClientCredentialFetcherProvider} from "../../../fetcher/clientcredential/client_credential_fetcher_provider";
import {AuthorizationCodeGrantHandler} from "../authorization_code_grant_handler";
import {PasswordGrantHandler} from "../password_grant_handler";
import {RefreshTokenGrantHandler} from "../refresh_token_grant_handler";
import {ClientCredentialsGrantHandler} from "../client_credentials_grant_handler";

test("DefaultGrantHandlerProvider provides preset handlers", t => {
  const clientCredentialFetcherProvider = stubInterface<ClientCredentialFetcherProvider>()
  const subject = new DefaultGrantHandlerProvider(clientCredentialFetcherProvider)

  const handlers = subject.handlers

  t.is(handlers.size, 4)
  t.is(handlers.get("authorization_code") instanceof AuthorizationCodeGrantHandler, true)
  t.is(handlers.get("password") instanceof PasswordGrantHandler, true)
  t.is(handlers.get("refresh_token") instanceof RefreshTokenGrantHandler, true)
  t.is(handlers.get("client_credentials") instanceof ClientCredentialsGrantHandler, true)
})
