import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  const options = {
    expiresIn: "1h",
  };

  return jwt.sign(payload, "secret_key", options);
};
