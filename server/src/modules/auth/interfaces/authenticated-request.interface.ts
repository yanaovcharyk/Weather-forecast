import { IAccessJwtPayload } from "./jwt-payload.interfaces";

export interface AuthenticatedRequest extends Request {
  user?: IAccessJwtPayload;
}
