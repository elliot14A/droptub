import { NextFunction, Request, Response } from "express";
import { Claims } from "../utils/jwt";
import { getSessionById } from "../service/session.service";

export default async (
  _: Request,
  res: Response<any, { user?: Claims }>,
  next: NextFunction,
) => {
  const user = res.locals.user;
  if (!user) {
    return res.sendStatus(403);
  }
  const session = await getSessionById({ id: user.sessionId });
  if (!session || !session.valid) return res.sendStatus(403);
  return next();
};
