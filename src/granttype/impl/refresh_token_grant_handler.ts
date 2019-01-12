import {AbstractGrantHandler} from "./abstract_grant_handler";
import {DataHandler} from "../../data/data_handler";
import {Result} from "../../utils/result";
import {GrantHandlerResult} from "../grant_handler";
import {InvalidClient, InvalidGrant} from "../../exceptions/oauth_error";
import {UnknownError} from "../../exceptions";

/**
 * This class is an implementation to re-issue an access token with the
 * specified refresh token.
 *
 * @author Yoichiro Tanaka
 */
export class RefreshTokenGrantHandler extends AbstractGrantHandler {

  /**
	 * Handle a request to issue a token and issue it.
	 * This method should be implemented for each grant type of OAuth2
	 * specification. For instance, the procedure uses a DataHandler instance
	 * to access to your database. Each grant type has some validation rule,
	 * if the validation is failed, this method will return a response with
   * the reason.
	 *
	 * @param dataHandler The DataHandler instance to access to your database.
	 * @return The issued token information as the result of calling this method.
	 */
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

    const result = await this.issueAccessToken(dataHandler, authInfo, "refresh_token")
    if (!result) {
      return Result.error(new UnknownError("Issuing Access token failed"))
    }
    return Result.success(result)
  }

}
