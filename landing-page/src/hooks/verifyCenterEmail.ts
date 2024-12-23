export const verifyCenterEmail = async (email: string) => {
  const response = await fetch(
    `http://localhost:3000/verify-center?email=${email}`,
  );
  const { success } = await response.json();
  return success;
}
