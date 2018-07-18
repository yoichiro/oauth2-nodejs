import {AbstractGrantHandler} from "./abstract_grant_handler";
import {DataHandler} from "../../data/data_handler";
import {Result} from "../../utils/result";
import {GrantHandlerResult} from "../grant_handler";
import {InvalidClient, InvalidGrant} from "../../exceptions/oauth_error";

export class ClientCredentialsGrantHandler extends AbstractGrantHandler {

  async handleRequest(dataHandler: DataHandler): Promise<Result<GrantHandlerResult>> {
    const request = dataHandler.getRequest()

    const clientCredentialResult = this.getClientCredential(request)
    if (clientCredentialResult.isError()) {
      return clientCredentialResult.convertError()
    }
    const clientCredential = clientCredentialResult.value
    const clientId = clientCredential.clientId
    const clientSecret = clientCredential.clientSecret

    const userId = await dataHandler.getClientUserId(clientId, clientSecret)
    if (!userId || userId.length === 0) {
      return Result.error(new InvalidClient(""))
    }

    const scope = request.getParameter("scope")

    const authInfo = await dataHandler.createOrUpdateAuthInfo(clientId, userId, scope)
    if (!authInfo) {
      return Result.error(new InvalidGrant(""))
    }

    const result = await this.issueAccessToken(dataHandler, authInfo)
    return Result.success(result)
  }

}