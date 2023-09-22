import { get } from "lodash";
import SessionModel, { SessionDocument } from "../models/session.model";
import { signJwt, verifyJwt } from "../utils/jwt";
import logger from "../utils/logger";
import { FilterQuery, UpdateQuery } from "mongoose";
import UserModel from "../models/user.model";

export async function createSession(userId: string) {
  const session = await SessionModel.create({ user: userId });
  return session.toJSON();
}

export async function getSessions(userId: string, valid: boolean) {
  const sessions = await SessionModel.find({ user: userId, valid }).lean();
  logger.info(sessions);
  return sessions;
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>,
) {
  await SessionModel.updateOne(query, update);
}

export async function reissueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded, expired } = verifyJwt(refreshToken);
  if (expired || !decoded) {
    return false;
  }

  const session = await getSessionById({ id: get(decoded, "sessionId") });
  if (!session || !session.valid) return false;

  const user = await UserModel.findById(get(decoded, "id"));
  if (!user) return false;

  const accessTokenTtl = process.env.ACCESSTOKENTTL || "15m";
  const newAccessToken = signJwt(
    { id: user._id, email: user.email, sessionId: session._id },
    { expiresIn: accessTokenTtl },
  );

  return newAccessToken;
}

export async function getSessionById({ id }: { id: string }) {
  return await SessionModel.findById(id).lean();
}
