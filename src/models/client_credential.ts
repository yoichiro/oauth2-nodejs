/**
 * This model class has an information of a client credential.
 *
 * @author Yoichiro Tanaka
 */
export class ClientCredential {

  private _clientId: string
  private _clientSecret: string

  /**
	 * Initialize this instance with arguments.
	 * @param clientId The client ID.
	 * @param clientSecret The client secret string.
	 */
  constructor(clientId: string, clientSecret: string) {
    this._clientId = clientId;
    this._clientSecret = clientSecret;
  }

  /**
	 * Retrieve the client ID.
	 * @return The client ID.
	 */
  get clientId(): string {
    return this._clientId;
  }

  /**
	 * Retrieve the client secret.
	 * @return The client secret.
	 */
  get clientSecret(): string {
    return this._clientSecret;
  }

}
