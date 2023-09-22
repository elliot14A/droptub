import jwt from "jsonwebtoken";
import logger from "./logger";

export interface Claims {
  id: string;
  email: string;
  sessionId: string;
}

export function signJwt(
  payload: Claims,
  options?: jwt.SignOptions | undefined,
) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    logger.error("private key is not set");
    process.exit();
  }
  return jwt.sign(payload, secret, {
    ...(options && options),
  });
}

export function verifyJwt(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    logger.error("private key is not set");
    process.exit();
  }
  try {
    const decoded = jwt.verify(token, secret) as Claims;
    return {
      expired: false,
      decoded,
    };
  } catch (err: any) {
    return {
      expired: err.message === "jwt expired",
      decoded: null,
    };
  }
}
