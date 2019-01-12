import {Request, AuthInfo, AccessToken} from "../models";

/**
 * This abstract class defines some functions to provide and store each
 * information regarding OAuth2.0 authorization.
 *
 * <p>This sub-class is used to process each OAuth2.0 flows. Some procedures to
 * process followed by OAuth2.0 depend on each provider which want to support
 * OAuth2.0. The provider must implement this DataHandler and provide them.</p>
 *
 * <p>Methods to be used are different for each grant type.</p>
 *
 * <p><b>[Authorization phases]</b></p>
 *
 * <p>
 * Authorization Code Grant:<br />
 *   <ul>
 *   <li>[[validateClientById]]</li>
 *   <li>[[validateClientForAuthorization]]</li>
 *   <li>[[validateRedirectUri]]</li>
 *   <li>[[validateScope]]</li>
 *   <li>[[createOrUpdateAuthInfo]]</li>
 *   <li>[[validateClient]]</li>
 *   <li>[[getAuthInfoByCode]]</li>
 *   <li>[[validateRedirectUri]]</li>
 *   <li>[[createOrUpdateAccessToken]]</li>
 *   </ul>
 * </p>
 *
 * <p>
 * Implicit Grant:<br />
 *   <ul>
 *   <li>[[validateClientById]]</li>
 *   <li>[[validateClientForAuthorization]]</li>
 *   <li>[[validateRedirectUri]]</li>
 *   <li>[[validateScope]]</li>
 *   <li>[[createOrUpdateAuthInfo]]</li>
 *   <li>[[createOrUpdateAccessToken]]</li>
 *   </ul>
 * </p>
 *
 * <p>
 * Refresh Token Grant:<br />
 *   <ul>
 *   <li>[[validateClient]]</li>
 *   <li>[[getAuthInfoByRefreshToken]]</li>
 *   <li>[[createOrUpdateAccessToken]]</li>
 *   </ul>
 * </p>
 *
 * <p>
 * Resource Owner Password Credentials Grant:<br />
 *   <ul>
 *   <li>[[validateClient]]</li>
 *   <li>[[getUserId]]</li>
 *   <li>[[validateScope]]</li>
 *   <li>[[createOrUpdateAuthInfo]]</li>
 *   <li>[[createOrUpdateAccessToken]]</li>
 *   </ul>
 * </p>
 *
 * <p>
 * Client Credentials Grant:<br />
 *   <ul>
 *   <li>[[validateClient]]</li>
 *   <li>[[getClientUserId]]</li>
 *   <li>[[validateScope]]</li>
 *   <li>[[createOrUpdateAuthInfo]]</li>
 *   <li>[[createOrUpdateAccessToken]]</li>
 *   </ul>
 * </p>
 *
 * <p>
 * <b>Access to Protected Resource phase]</b><br />
 *   <ul>
 *   <li>[[getAccessToken]]</li>
 *   <li>[[getAuthInfoById]]</li>
 *   <li>[[validateClientById]]</li>
 *   <li>[[validateUserById]]</li>
 *   </ul>
 * </p>
 *
 * @author Yoichiro Tanaka
 */
export interface DataHandler {

  /**
	 * Retrieve the request instance passed at creating this instance.
	 * @return The request instance.
	 */
  getRequest(): Request

  /**
	 * Validate the client and return the result.
	 * This method is called at first for all grant types.
	 * You should check whether the client specified by clientId value exists
	 * or not, whether the client secret is valid or not, and whether
	 * the client supports the grant type or not. If there are other things
	 * to have to check, they must be implemented in this method.
	 * @param clientId The client ID.
	 * @param clientSecret The client secret string.
	 * @param grantType The grant type string which the client required.
	 * @return True if the client is valid.
	 */
  validateClient(clientId: string, clientSecret: string, grantType: string): Promise<boolean>

  /**
	 * Validate the client specified by the client ID.
	 * This method is used to check the client at accessing a protected resource.
	 * When the access token passed from the client is valid, the client status
	 * may be invalid in the OAuth provider side. In this case, this method must
	 * return false to refuse the access to all API endpoints.
	 * @param clientId The client ID.
	 * @return If the client status is invalid, return false, otherwise, return
	 * true.
	 */
  validateClientById(clientId: string): Promise<boolean>

  /**
   * Validate the client specified by the responseType for authorization.
   * This method is used to check the client which supports the specified
   * response type. If the client doesn't support the response type, this method
   * should return false.
   * @param clientId The client ID.
   * @param responseType The response type you want to check.
   * @return If the client supports the response type, return true. Otherwise,
   * return false.
   */
  validateClientForAuthorization(clientId: string, responseType: string): Promise<boolean>

  /**
   * Validate the redirect URI for the client.
   * This method is used to check whether the specified redurectUri string is
   * valid or not for the client. Usually, each client has valid redirect URI list.
   * This method checks the redirectUri string based on the list.
   * @param clientId The client ID.
   * @param redirectUri The redirect URI string you want to check.
   * @return If the redirect URI is valid for the client, return true. Otherwise,
   * return false.
   */
  validateRedirectUri(clientId: string, redirectUri: string): Promise<boolean>

  /**
   * Validate the scope for the client.
   * This method is used to check whether the passed scopes (actually, this
   * may include multiple scope strings) are supported by the client or nor.
   * @param clientId The client ID.
   * @param scope The scope string. This format is a string delimitered by a white
   * space.
   * @return If all scopes are valid, return true. Otherwise, return false.
   */
  validateScope(clientId: string, scope?: string): Promise<boolean>

  /**
	 * Retrieve the user's ID from the user's credential.
	 * This method is used for the Resource Owner Password Credential Grant only.
	 * Normally, you should implement this process like retrieving the user's ID
	 * from your database and checking the password.
	 * If the null value or the empty string is returned from this method as the
	 * result, the error type "invalid_grant" will be sent to the client.
	 * @param username The user name inputed by the user his/herself.
	 * @param password The password string inputed by the user.
	 * @return The user's ID string. If the user is not found, you must return
	 * a null value or an empty string.
	 */
  getUserId(username: string, password: string): Promise<string | undefined>

  /**
	 * Create or update an Authorization information.
	 * This method is used when the authorization information should be created
	 * or updated directly against receiving of the request in case of Client
	 * Credential grant or Resource Owner Password Credential grant.
	 * If the null value is returned from this method as the result, the error
	 * type "invalid_grant" will be sent to the client.
	 * @param clientId The client ID.
	 * @param userId The user's ID.
	 * @param scope The scope string.
	 * @return The created or updated the information about authorization.
	 */
  createOrUpdateAuthInfo(clientId: string, userId: string, scope?: string): Promise<AuthInfo | undefined>

  /**
	 * Create or update an Access token.
	 * This method is used for all grant types. The access token is created or
	 * updated based on the authInfo's property values. In generally, this
	 * method never failed, because all validations should be passed before
	 * this method is called.
	 * @param authInfo The instance which has the information about authorization.
	 * @return The created or updated access token instance.
	 */
  createOrUpdateAccessToken(authInfo: AuthInfo, grantType: string): Promise<AccessToken | undefined>

  /**
	 * Retrieve the authorization information by the authorization code value.
	 * This method is used for an Authorization Code grant. The authorization
	 * information which should be returned as this result is needed to create
	 * at the authentication and authorization timing by the user. If the null
	 * value is returned as this result, the error type "invalid_grant" will be
	 * sent to the client.
	 * @param code The authorization code value.
	 * @return The authorization information instance.
	 */
  getAuthInfoByCode(code: string): Promise<AuthInfo | undefined>

  /**
	 * Retrieve the authorization information by the refresh token string.
	 * This method is used to re-issue an access token with the refresh token.
	 * The authorization information which has already been stored into your
	 * database should be specified by the refresh token. If you want to define
	 * the expiration of the refresh token, you must check it in this
	 * implementation. If the refresh token is not found, the refresh token is
	 * invalid or there is other reason which the authorization information
	 * should not be returned, this method must return the null value as the
	 * result.
	 * @param refreshToken The refresh token string.
	 * @return The authorization information instance.
	 */
  getAuthInfoByRefreshToken(refreshToken: string): Promise<AuthInfo | undefined>

  /**
	 * Determine an user ID representing the client itself and return it.
	 * This method is used for the Client Credentials grant. In this flow,
	 * there is no user to authorize, and OAuth2 provider trusts the client.
	 * Therefore, the user ID representing the client itself should be issued,
	 * and the ID can be distinguished whether it represents an user or a client.
	 * @param clientId The client ID.
	 * @param clientSecret The client secret string.
	 * @return The ID representing the client.
	 */
  getClientUserId(clientId: string, clientSecret: string): Promise<string | undefined>

  /**
	 * Validate the user specified by the user ID.
	 * This method is used to check the user at accessing a protected resource.
	 * When the access token passed from the client is valid, the user status
	 * may be invalid or may be left in the OAuth provider side. In these case,
	 * this method must return false to refuse the access to all API endpoints.
	 * @param userId The user's ID.
	 * @return If the user's status is invalid, return false, otherwise, return
	 * true.
	 */
  validateUserById(userId: string): Promise<boolean>

  /**
	 * Retrieve the access token from the token string.
	 * This method is used at accessing a protected resource. This sub class
	 * should fetch the access token information from your database or etc and
	 * return it. If the access token has been revoked by the user or there is
	 * other reason, this method must return the null value to refuse the access
	 * to all API endpoints.
	 * @param token The access token string.
	 * @return The object which has the information for the access token.
	 */
  getAccessToken(token: string): Promise<AccessToken | undefined>

  /**
	 * Retrieve the authorization information by the ID.
	 * This method is used at accessing a protected resource. The getAccessTkoken()
	 * method is called before this method calling. The result has a ID of the
	 * authorization information. The ID is passed to this method as an
	 * argument. This sub class must return the authorization information instance
	 * to the client. If the ID has already been invalid or there is other reason,
	 * this implementation must return the null value.
	 * @param id The ID to specify the authorization information.
	 * @return The object which has the information about the authorization.
	 */
  getAuthInfoById(id: string): Promise<AuthInfo | undefined>

}
