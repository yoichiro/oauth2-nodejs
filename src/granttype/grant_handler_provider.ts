import {GrantHandler} from "./grant_handler";

/**
 * This class provides a grant handler instance by specified grant type name.
 *
 * @author Yoichiro Tanaka
 */
export class GrantHandlerProvider {

  private _handlers: Map<string, GrantHandler>

  /**
	 * Retrieve the grant handler instance for the specified grant type.
	 *
	 * @param type The grant type string.
	 * @return The grant handler instance. The null is returned when the target
	 * grant handler is not found for the specified grant type.
	 */
  public getHandler(type: string): GrantHandler | undefined {
    return this._handlers.get(type)
  }

  /**
	 * Retrieve the map instance which has grant handlers
	 * This method is provided for an unit test.
	 * @return The map object which has grant handlers.
	 */
  public get handlers(): Map<string, GrantHandler> {
    return this._handlers
  }

  /**
	 * Set the map instance which has grant handlers.
	 * The key means a grant type. The value is each grant handler instance.
	 * @param handlers The map object which has grant handlers.
	 */
  public set handlers(handler: Map<string, GrantHandler>) {
    this._handlers = handler
  }

}
