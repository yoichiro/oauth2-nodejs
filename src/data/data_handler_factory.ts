import {Request} from "../models/request";
import {DataHandler} from "./data_handler";

export interface DataHandlerFactory {

  create(request: Request): DataHandler

}
