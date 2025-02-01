import jwt from "jsonwebtoken";

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || "defaultPrivateKey";

export const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, role: user.role }, PRIVATE_KEY, { expiresIn: "1h" });

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, PRIVATE_KEY);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
