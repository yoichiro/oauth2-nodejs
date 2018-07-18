import {GrantHandler} from "./grant_handler";

export class GrantHandlerProvider {

  private _handlers: Map<string, GrantHandler>

  public getHandler(type: string): GrantHandler | undefined {
    return this._handlers.get(type)
  }

  public get handlers(): Map<string, GrantHandler> {
    return this._handlers
  }

  public set handlers(handler: Map<string, GrantHandler>) {
    this._handlers = handler
  }

}
