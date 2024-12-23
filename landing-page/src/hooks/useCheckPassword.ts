export const useCheckPassword = (password: string): string | null => {
  // Regular expression to check the password
  const minLength = /.{8,}/; // At least 8 characters
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/; // At least one symbol
  const hasCapitalLetter = /[A-Z]/; // At least one uppercase letter

  if (!minLength.test(password)) {
    return "Password must be at least 8 characters long.";
  }

  if (!hasSymbol.test(password)) {
    return "Password must contain at least one symbol.";
  }

  if (!hasCapitalLetter.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  // If all checks pass, return null (no error)
  return null;
};
