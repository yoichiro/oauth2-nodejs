import {AbstractGrantHandler} from "./abstract_grant_handler";
import {DataHandler} from "../../data/data_handler";
import {GrantHandlerResult} from "../grant_handler";
import {InvalidClient, InvalidGrant} from "../../exceptions/oauth_error";
import {Result} from "../../utils/result";
import {UnknownError} from "../../exceptions";

export class PasswordGrantHandler extends AbstractGrantHandler {

  async handleRequest(dataHandler: DataHandler): Promise<Result<GrantHandlerResult>> {
    const request = dataHandler.getRequest()

    const clientCredentialResult = this.getClientCredential(request)
    if (clientCredentialResult.isError()) {
      return clientCredentialResult.convertError()
    }
    const clientCredential = clientCredentialResult.value
    const clientId = clientCredential.clientId

    let getParameterResult = this.getParameter(request, "username")
    if (getParameterResult.isError()) {
      return getParameterResult.convertError()
    }
    const username = getParameterResult.value

    getParameterResult = this.getParameter(request, "password")
    if (getParameterResult.isError()) {
      return getParameterResult.convertError()
    }
    const password = getParameterResult.value

    const userId = await dataHandler.getUserId(username, password)
    if (!userId || userId.length === 0) {
      return Result.error(new InvalidGrant(""))
    }
    const scope = request.getParameter("scope")

    const authInfo = await dataHandler.createOrUpdateAuthInfo(clientId, userId, scope)
    if (!authInfo) {
      return Result.error(new InvalidGrant(""))
    }
    if (authInfo.clientId !== clientId) {
      return Result.error(new InvalidClient(""))
    }

    const result = await this.issueAccessToken(dataHandler, authInfo)
    if (!result) {
      return Result.error(new UnknownError("Issuing Access token failed"))
    }
    return Result.success(result)
  }

}
