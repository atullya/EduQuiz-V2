import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { APIError } from "../middleware/APIError";

export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}
const getJwtSecret = (): Secret => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return process.env.JWT_SECRET as Secret;
};
export const generateAccessToken = (userId: string): string => {
  const secret = getJwtSecret();
  const options: SignOptions = {
    expiresIn:
      (process.env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]) || "15m",
  };
  return jwt.sign({ userId }, secret, options);
};
export const generateRefreshToken = (userId: string): string => {
  const secret = getJwtSecret();
  const options: SignOptions = {
    expiresIn:
      (process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]) || "7d",
  };
  return jwt.sign({ userId }, secret, options);
};
export const verifyRefreshToken = (token: string): JwtPayload => {
  const secret = getJwtSecret();
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (err: any) {
    if (err.name === "TokenExpiredError")
      throw new APIError("Refresh token expired", 401);
    throw new APIError("Invalid refresh token", 401);
  }
};
