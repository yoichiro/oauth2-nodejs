import {DataHandler} from "../data/data_handler";
import {Result} from "../utils/result";

/**
 * This interface defines how to issue a token for each grant type.
 * The issued token is passed to the client as the [[GrantHandlerResult]] instance.
 *
 * @author Yoichiro Tanaka
 */
export interface GrantHandler {

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
  handleRequest(dataHandler: DataHandler): Promise<Result<GrantHandlerResult>>

}

/**
	 * This class has the information about issued token.
	 *
	 * @author Yoichiro Tanaka
	 */
export class GrantHandlerResult {

  private _tokenType: string
  private _accessToken: string
  private _expiresIn: number
  private _refreshToken: string
  private _scope: string

  /**
   * Initialize this instance with these arguments.
   * These parameters is required.
   *
   * @param tokenType The token type string.
   * @param accessToken The access token string.
   */
  constructor(tokenType: string, accessToken: string) {
    this._tokenType = tokenType;
    this._accessToken = accessToken;
  }

  /**
   * Retrieve the token type.
   * @return The issued token's type.
   */
  get tokenType(): string {
    return this._tokenType;
  }

  /**
   * Retrieve the access token.
   * @return The issued access token string.
   */
  get accessToken(): string {
    return this._accessToken;
  }

  /**
   * Retrieve the expires_in value.
   * @return The expires_in value (this unit is second).
   */
  get expiresIn(): number {
    return this._expiresIn;
  }

  /**
   * Set the expires_in parameter's value.
   * An unit of this value is second.
   * @param expiresIn The expires_in value.
   */
  set expiresIn(value: number) {
    this._expiresIn = value;
  }

  /**
   * Retrieve the refresh token.
   * @return The issued refresh token string.
   */
  get refreshToken(): string {
    return this._refreshToken;
  }

  /**
   * Set the refresh token.
   * If a grant type which issues the refresh token is specified,
   * the issued refresh token is passed to the client via this method.
   * @param refreshToken The refresh token string.
   */
  set refreshToken(value: string) {
    this._refreshToken = value;
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
   * This scope string specified by the client is passed to
   * this method untouched.
   * @param scope The scope string.
   */
  set scope(value: string) {
    this._scope = value;
  }

  /**
   * Generate the JSON string represents this object.
   * @return The JSON string.
   */
  public toJson(): string {
    return JSON.stringify({
      "token_type": this.tokenType,
      "access_token": this.accessToken,
      "expires_in": this.expiresIn,
      "refresh_token": this.refreshToken
    })
  }

}
