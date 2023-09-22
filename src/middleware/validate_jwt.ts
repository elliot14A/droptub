import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { Claims, verifyJwt } from "../utils/jwt";
import { reissueAccessToken } from "../service/session.service";

export default async (
  req: Request,
  res: Response<any, { user: Claims }>,
  next: NextFunction,
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    "",
  );
  let refreshToken = get(req, "headers.x-refresh");
  if (refreshToken) {
    refreshToken = (refreshToken as string).replace(/^Bearer\s/, "");
  }
  if (!accessToken) {
    return next();
  }
  const { decoded, expired } = verifyJwt(accessToken);
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reissueAccessToken({ refreshToken } as {
      refreshToken: string;
    });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
    }

    const result = verifyJwt(newAccessToken as string);
    res.locals.user = result.decoded!;
    return next();
  }

  return next();
};
