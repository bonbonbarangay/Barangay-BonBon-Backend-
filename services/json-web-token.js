import jwt from "jsonwebtoken";
import "dotenv/config";

const secretKey = process.env.JWTKEY;

export const GenerateToken = (payload, expiresIn = "3d") => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

export const VerifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
