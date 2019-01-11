/**
 * This interface defines some method to retrieve the information from the request
 * for processing each OAuth2.0 authorization.
 *
 * @author Yoichiro Tanaka
 */
export interface Request {

  /**
	 * Retrieve the parameter value specified by the parameter name
	 * from the request.
	 * @param name The parameter name.
	 * @return The value against the name.
	 */
  getParameter(name: string): string | undefined

  /**
	 * Retrieve all parameter names and values from the request as a Map instance.
	 * @return  The map instance which has all parameter names and values.
	 */
  getParameterMap(): Map<string, string>

  /**
	 * Retrieve the request header value from the request.
	 * @param name The header's name.
	 * @return The value against the name.
	 */
  getHeader(name: string): string | undefined

}
