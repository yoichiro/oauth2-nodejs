/**
 * This model class has some parameters to authorize.
 * A life-cycle of this model is different each grant types.
 * If the Authorization Code grant type is applied, this model will be created
 * after the authentication of the user. In other case, if the Client
 * Credentials grant type is applied, this model will be created at the same
 * time of receiving the request to issue the access token.
 *
 * @author Yoichiro Tanaka
 */
export class AuthInfo {

  private _id: string
  private _userId: string
  private _clientId: string
  private _scope: string
  private _refreshToken: string
  private _code: string
  private _redirectUri: string
  private _additionalInfo: Map<string, string>

  /**
   * Initialize this instance.
   */
  constructor() {
    this._additionalInfo = new Map<string, string>()
  }

  /**
	 * Retrieve the ID of this model.
	 * @return The ID string value.
	 */
  get id(): string {
    return this._id;
  }

  /**
	 * Set the ID of this model.
	 * This ID value will be kept by some access token's information.
	 * @param id The ID value.
	 */
  set id(value: string) {
    this._id = value;
  }

  /**
	 * Retrieve the user's ID.
	 * @return The user's ID string.
	 */
  get userId(): string {
    return this._userId;
  }

  /**
	 * Set the user's ID who is authenticated.
	 * @param userId The user's ID value.
	 */
  set userId(value: string) {
    this._userId = value;
  }

  /**
	 * Retrieve the client ID.
	 * @return The client ID string.
	 */
  get clientId(): string {
    return this._clientId;
  }

  /**
	 * Set the client ID.
	 * @param clientId The client ID.
	 */
  set clientId(value: string) {
    this._clientId = value;
  }

  /**
	 * Retrieve the scope string.
	 * @return The scope string.
	 */
  get scope(): string {
    return this._scope;
  }

  /**
	 * Set the scope string.
	 * This scope string has some scope identifiers delimited by a whitespace.
	 * @param scope The scope string.
	 */
  set scope(value: string) {
    this._scope = value;
  }

  /**
	 * Retrieve the refresh token.
	 * @return The refresh token string.
	 */
  get refreshToken(): string {
    return this._refreshToken;
  }

  /**
	 * Set the refresh token.
	 * If the specified grant type should not return a refresh token,
	 * this method must be set with a null as an argument.
	 * @param refreshToken The refresh token string.
	 */
  set refreshToken(value: string) {
    this._refreshToken = value;
  }

  /**
	 * Retrieve the authorization code.
	 * @return The authorization code value.
	 */
  get code(): string {
    return this._code;
  }

  /**
	 * Set the authorization code.
	 * If the grant type which doesn't need the authorization code is required,
	 * this method must not be called.
	 * @param code The authorization code value.
	 */
  set code(value: string) {
    this._code = value;
  }

  /**
	 * Retrieve the redirect_uri string.
	 * @return The redirect_uri string.
	 */
  get redirectUri(): string {
    return this._redirectUri;
  }

  /**
	 * Set the redirect_uri string.
	 * @param redirectUri The redirect_uri string.
	 */
  set redirectUri(value: string) {
    this._redirectUri = value;
  }

  /**
   * Retrieve additional information related to the specific name.
   * @param name The name you want to get.
   * @return The additional information value.
   */
  getAdditionalInfo(name: string): string | undefined {
    return this._additionalInfo.get(name)
  }

  /**
   * Set the additional information.
   * @param name The name of the additional information.
   * @param value The value of the additional information.
   */
  setAdditionalInfo(name: string, value: string): void {
    this._additionalInfo.set(name, value)
  }

  /**
   * Delete the additional information related to the specific name.
   * @param name The name you want to delete.
   */
  deleteAdditionalInfo(name: string): void {
    this._additionalInfo.delete(name)
  }

  /**
   * Retrieve all names of additional information.
   * @return All names.
   */
  getAdditionalInfoNames(): string[] {
    return [ ...this._additionalInfo.keys() ]
  }

}
