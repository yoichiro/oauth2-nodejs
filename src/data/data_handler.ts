import {Request, AuthInfo, AccessToken} from "../models";

export interface DataHandler {

  getRequest(): Request

  validateClient(clientId: string, clientSecret: string, grantType: string): Promise<boolean>

  validateClientById(clientId: string): Promise<boolean>

  validateClientForAuthorization(clientId: string, responseType: string): Promise<boolean>

  validateRedirectUri(clientId: string, redirectUri: string): Promise<boolean>

  validateScope(clientId: string, scope?: string): Promise<boolean>

  getUserId(username: string, password: string): Promise<string | undefined>

  createOrUpdateAuthInfo(clientId: string, userId: string, scope?: string): Promise<AuthInfo | undefined>

  createOrUpdateAccessToken(authInfo: AuthInfo): Promise<AccessToken | undefined>

  getAuthInfoByCode(code: string): Promise<AuthInfo | undefined>

  getAuthInfoByRefreshToken(refreshToken: string): Promise<AuthInfo | undefined>

  getClientUserId(clientId: string, clientSecret: string): Promise<string | undefined>

  validateUserById(userId: string): Promise<boolean>

  getAccessToken(token: string): Promise<AccessToken | undefined>

  getAuthInfoById(id: string): Promise<AuthInfo | undefined>

}
