/**
 * This model class has an information about an access token.
 * The access token is issued related on one authorization information.
 * Actually, an instance of this model is created by an DataHandler.
 * The DataHandler implementation may store this to your database or
 * something to cache in memory or other lightweight storage.
 * @author Yoichiro Tanaka
 *
 */
export class AccessToken {

  private _authId: string
  private _token: string
  private _expiresIn: number
  private _createdOn: number

  /**
	 * Retrieve the ID of the authorization information.
	 * @return The ID string.
	 */
  get authId(): string {
    return this._authId;
  }

  /**
	 * Set the ID of the authorization information to relate between the
	 * information and this access token.
	 * @param authId The ID of the authorization information.
	 */
  set authId(value: string) {
    this._authId = value;
  }

  /**
	 * Retrieve the access token.
	 * @return The access token string.
	 */
  get token(): string {
    return this._token;
  }

  /**
	 * Set the issued access token.
	 * @param token The access token string.
	 */
  set token(value: string) {
    this._token = value;
  }

  /**
	 * Retrieve the expiration time of this access token.
	 * @return The expiration time value. This unit is second.
	 */
  get expiresIn(): number {
    return this._expiresIn;
  }

  /**
	 * Set the expiration time of this access token.
	 * If this access token has a time limitation, this value must be positive.
	 * @param expiresIn The expiration time value. The unit is second.
	 */
  set expiresIn(value: number) {
    this._expiresIn = value;
  }

  /**
	 * Retrieve the time when this access token is created.
	 * @return The date and time value when this is created.
	 */
  get createdOn(): number {
    return this._createdOn;
  }

  /**
	 * Set the time when this access token is created.
	 * @param createdOn The date and time value.
	 */
  set createdOn(value: number) {
    this._createdOn = value;
  }

}
