import {Request} from "../models/request";
import {DataHandler} from "./data_handler";

/**
 * This class provides an ability to create a concrete instance of [[DataHandler]].
 * 
 * When you use the implementation class of [[DataHandler]], you must also
 * implement this sub class to create the instance of your concrete
 * [[DataHandler]] class.
 *
 * [[DataHandler]] instance should be create per request. Therefore, the request
 * instance is passed to this [[create]] method. Or, you might be able to keep
 * the [[DataHandler]] instance(s) in this factory instance to cache for performance.
 *
 * @author Yoichiro Tanaka
 */
export interface DataHandlerFactory {

  /**
	 * Create a DataHandler instance and return it.
	 * This implementation method must create the instance based on a concrete
	 * class of the DataHandler abstract class.
	 * @param request The request object to provide some information passed from
	 * client.
	 * @return The DataHandler instance.
	 */
  create(request: Request): DataHandler

}
