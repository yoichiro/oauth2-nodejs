import {AbstractGrantHandler} from "./abstract_grant_handler";
import {DataHandler} from "../../data/data_handler";
import {Result} from "../../utils/result";
import {GrantHandlerResult} from "../grant_handler";
import {InvalidClient, InvalidGrant} from "../../exceptions/oauth_error";

export class RefreshTokenGrantHandler extends AbstractGrantHandler {

  async handleRequest(dataHandler: DataHandler): Promise<Result<GrantHandlerResult>> {
    const request = dataHandler.getRequest()

    const clientCredentialResult = this.getClientCredential(request)
    if (clientCredentialResult.isError()) {
      return clientCredentialResult.convertError()
    }
    const clientCredential = clientCredentialResult.value
    const clientId = clientCredential.clientId

    const getParameterResult = this.getParameter(request, "refresh_token")
    if (getParameterResult.isError()) {
      return getParameterResult.convertError()
    }
    const refreshToken = getParameterResult.value

    const authInfo = await dataHandler.getAuthInfoByRefreshToken(refreshToken)
    if (!authInfo) {
      return Result.error(new InvalidGrant(""))
    }
    if (authInfo.clientId !== clientId) {
      return Result.error(new InvalidClient(""))
    }

    const result = await this.issueAccessToken(dataHandler, authInfo)
    return Result.success(result)
  }

}
