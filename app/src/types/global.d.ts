import { User as UserModel } from "./models";
import { Alpine as AlpineType } from "alpinejs";

interface AddAutocompletes {
  (autocompletes: AutocompleteI[]): void;
}

declare global {
  namespace Express {
    interface User extends UserModel {}
    interface Request {
      user: UserModel;
      isAuthenticated: () => boolean;
      flash: (type: string, message: string) => void;
    }
  }
  interface Window {
    addAutocompletes: AddAutocompletes;
    Alpine: typeof AlpineType;
  }
}
