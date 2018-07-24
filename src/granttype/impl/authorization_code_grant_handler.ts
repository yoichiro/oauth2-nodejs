import {AbstractGrantHandler} from "./abstract_grant_handler";
import {DataHandler} from "../../data";
import {Result} from "../../utils";
import {GrantHandlerResult} from "../grant_handler";
import {InvalidClient, InvalidGrant, RedirectUriMismatch, UnknownError} from "../../exceptions";

export class AuthorizationCodeGrantHandler extends AbstractGrantHandler {

  async handleRequest(dataHandler: DataHandler): Promise<Result<GrantHandlerResult>> {
    const request = dataHandler.getRequest()

    const clientCredentialResult = this.getClientCredential(request)
    if (clientCredentialResult.isError()) {
      return clientCredentialResult.convertError()
    }
    const clientCredential = clientCredentialResult.value
    const clientId = clientCredential.clientId

    const getCodeResult = this.getParameter(request, "code")
    if (getCodeResult.isError()) {
      return getCodeResult.convertError()
    }
    const code = getCodeResult.value

    const getRedirectUriResult = this.getParameter(request, "redirect_uri")
    if (getRedirectUriResult.isError()) {
      return getRedirectUriResult.convertError()
    }
    const redirectUri = getRedirectUriResult.value

    const authInfo = await dataHandler.getAuthInfoByCode(code)
    if (!authInfo) {
      return Result.error(new InvalidGrant(""))
    }
    if (authInfo.clientId !== clientId) {
      return Result.error(new InvalidClient(""))
    }
    if (!await dataHandler.validateRedirectUri(clientId, redirectUri)) {
      return Result.error(new RedirectUriMismatch(""))
    }

    const result = await this.issueAccessToken(dataHandler, authInfo, "authorization_code")
    if (!result) {
      return Result.error(new UnknownError("Issuing Access token failed"))
    }
    return Result.success(result)
  }

}
