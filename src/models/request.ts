export interface Request {

  getParameter(name: string): string | undefined
  getParameterMap(): Map<string, string>
  getHeader(name: string): string

}
