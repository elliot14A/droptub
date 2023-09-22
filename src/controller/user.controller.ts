import { Request, Response } from "express";
import { createUser, updateUser } from "../service/user.service";
import { CreateUserSchema, SubscriptionSchema } from "../schema/user.schema";
import logger from "../utils/logger";
import { Claims } from "../utils/jwt";
import { Tier } from "../models/user.model";

export async function registerHanlder(
  req: Request<any, any, CreateUserSchema["body"]>,
  res: Response,
) {
  try {
    const user = await createUser(req.body);
    return res.status(201).json(user);
  } catch (err: any) {
    const message = err.message as string;
    if (message.includes("duplicate")) {
      return res.status(409).json({
        message: "email is already taken",
      });
    }
    logger.error(err);
    return res.status(500).json({
      message: "internal server error",
    });
  }
}

export async function upgradeSubscriptionHandler(
  req: Request<any, any, SubscriptionSchema["body"]>,
  res: Response<any, { user: Claims }>,
) {
  const { email, subscriptionId } = req.body;
  let master_key_from_headers = req.headers.authorization;
  master_key_from_headers?.replace(/^Bearer\s/, "");
  const master_key = process.env.MASTER_KEY;
  if (master_key === master_key_from_headers) return res.send(403);
  try {
    const user = await updateUser(
      { email },
      { tier: Tier.premium, subscriptionId },
      { new: true },
    );
    return res.json(user);
  } catch (err) {
    return res.json("Internal server error").status(500);
  }
}

export async function cancelSubscriptionHandler(
  req: Request<any, any, SubscriptionSchema["body"]>,
  res: Response<any>,
) {
  const { email } = req.body;
  let master_key_from_headers = req.headers.authorization;
  master_key_from_headers?.replace(/^Bearer\s/, "");
  const master_key = process.env.MASTER_KEY;
  if (master_key === master_key_from_headers) return res.send(403);
  try {
    const user = await updateUser(
      { email },
      { tier: Tier.freemium, subscriptionId: "" },
      { new: true },
    );
    return res.json(user);
  } catch (err) {
    return res.json("Internal server error").status(500);
  }
}
