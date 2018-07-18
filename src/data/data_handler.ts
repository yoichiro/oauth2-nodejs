import {Request} from "../models/request";
import {AuthInfo} from "../models/auth_info";
import {AccessToken} from "../models/access_token";

export interface DataHandler {

  getRequest(): Request

  validateClient(clientId: string, clientSecret: string, grantType: string): Promise<boolean>

  getUserId(username: string, password: string): Promise<string>

  createOrUpdateAuthInfo(clientId: string, userId: string, scope?: string): Promise<AuthInfo>

  createOrUpdateAccessToken(authInfo: AuthInfo): Promise<AccessToken>

  getAuthInfoByCode(code: string): Promise<AuthInfo>

  getAuthInfoByRefreshToken(refreshToken: string): Promise<AuthInfo>

  getClientUserId(clientId: string, clientSecret: string): Promise<string>

  validateClientById(clientId: string): Promise<boolean>

  validateUserById(userId: string): Promise<boolean>

  getAccessToken(token: string): Promise<AccessToken>

  getAuthInfoById(id: string): Promise<AuthInfo>

}
