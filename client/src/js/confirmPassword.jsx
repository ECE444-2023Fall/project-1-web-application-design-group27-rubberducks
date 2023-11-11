export const confirmPassword = async (email, password) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return res.ok;
};

export async function checkPassword(email, password) {
  const isValid = await confirmPassword(email, password);
  return isValid;
}
