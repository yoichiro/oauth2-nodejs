export class ClientCredential {

  private _clientId: string
  private _clientSecret: string

  constructor(clientId: string, clientSecret: string) {
    this._clientId = clientId;
    this._clientSecret = clientSecret;
  }

  get clientId(): string {
    return this._clientId;
  }

  get clientSecret(): string {
    return this._clientSecret;
  }

}