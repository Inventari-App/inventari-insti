import { User as UserModel } from "./models";

declare global {
  namespace Express {
    interface User extends UserModel {}
    interface Request {
      user: UserModel;
      isAuthenticated: () => boolean;
      flash: (type: string, message: string) => void;
    }
  }
}
