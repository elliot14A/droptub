import { Request, Response } from "express";
import {
  createSession,
  getSessions,
  updateSession,
} from "../service/session.service";
import { Claims, signJwt } from "../utils/jwt";
import { getUserById, validatePassword } from "../service/user.service";
import { CreateSessionSchema } from "../schema/session.schema";

export async function login(
  req: Request<any, any, CreateSessionSchema["body"]>,
  res: Response,
) {
  // check password
  const user = await validatePassword(req.body);
  if (!user) {
    return res.status(401).json({
      message: "invalid email or password",
    });
  }

  // create a session
  const session = await createSession(user._id);

  // create accessToken
  const accessTokenTtl = process.env.ACCESSTOKENTTL || "15m";
  const refreshTokenTtl = process.env.REFRESHTOKENTTL || "1y";
  const accessToken = signJwt(
    {
      id: user._id,
      email: user.email,
      sessionId: session._id.toString(),
    },
    {
      expiresIn: accessTokenTtl,
    },
  );

  const refreshToken = signJwt(
    {
      id: user._id,
      email: user.email,
      sessionId: session._id.toString(),
    },
    {
      expiresIn: refreshTokenTtl,
    },
  );

  return res.status(201).json({ refreshToken, accessToken });
}

export async function getUserSessions(
  _: Request,
  res: Response<any, { user: Claims }>,
) {
  const id = res.locals.user.id;
  const sessions = await getSessions(id, true);
  return res.json(sessions);
}

export async function logout(_: Request, res: Response<any, { user: Claims }>) {
  const id = res.locals.user.sessionId;
  await updateSession({ _id: id }, { valid: false });
  return res.json({
    refreshToken: null,
    accessToken: null,
  });
}

export async function userInfo(
  _: Request,
  res: Response<any, { user: Claims }>,
) {
  const id = res.locals.user.id;
  const user = await getUserById({ id });
  if (!user) {
    return res.status(403).json({
      message: "forbidden",
    });
  }
  return res.json(user);
}
