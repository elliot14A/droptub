import express, { Request, Response } from "express";
import {
  cancelSubscriptionHandler,
  registerHanlder,
  upgradeSubscriptionHandler,
} from "./controller/user.controller";
import { validate } from "./middleware/validate";
import { createUserSchema, subscriptionSchema } from "./schema/user.schema";
import {
  logout,
  getUserSessions,
  login,
  userInfo,
} from "./controller/session.controller";
import {
  canUploadImageHandler,
  deleteImageHandler,
  getImagesHandler,
  uploadImagesHandler,
} from "./controller/image.controller";
import { createSessionSchema } from "./schema/session.schema";
import validate_jwt from "./middleware/validate_jwt";
import authorize from "./middleware/authorize";
import { createImageSchema, deleteImageSchema } from "./schema/image.schema";
import {
  createRequestHandler,
  updateRequestHandler,
} from "./controller/request.controller";

export function initroutes(): express.Router {
  const router = express.Router();
  router.use(validate_jwt);
  router.get("/health", (_: Request, res: Response) => res.sendStatus(200));
  router.post("/register", validate(createUserSchema), registerHanlder);
  router.post("/login", validate(createSessionSchema), login);
  router.post("/requests", authorize, createRequestHandler);
  router.put("/requests/:requestId", authorize, updateRequestHandler);
  router.post(
    "/upgradeSubscription",
    validate(subscriptionSchema),
    upgradeSubscriptionHandler,
  );
  router.post(
    "/cancelSubscription",
    validate(subscriptionSchema),
    cancelSubscriptionHandler,
  );
  router.post("/logout", authorize, logout);
  router.get("/sessions", authorize, getUserSessions);
  router.get("/user_info", authorize, userInfo);
  router.post(
    "/images",
    validate(createImageSchema),
    authorize,
    uploadImagesHandler,
  );
  router.delete(
    "/images/:imageId",
    validate(deleteImageSchema),
    authorize,
    deleteImageHandler,
  );
  router.get("/images", authorize, getImagesHandler);
  router.get("/canUpload", authorize, canUploadImageHandler);
  return router;
}
