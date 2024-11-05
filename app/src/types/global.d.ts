import { Alpine as AlpineType } from "alpinejs";

interface AddAutocompletes {
  (autocompletes: AutocompleteI[]): void;
}

export {}

declare global {
  interface Window {
    addAutocompletes: AddAutocompletes;
    Alpine: typeof AlpineType;
  }
}
