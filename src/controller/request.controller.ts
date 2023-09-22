import { Request, Response } from "express";
import { Claims } from "../utils/jwt";
import { createRequest, updateRequest } from "../service/request.service";
import { UpdateRequestSchema } from "../schema/request.schema";

export const createRequestHandler = async (
  req: Request,
  res: Response<any, { user: Claims }>,
) => {
  const userId = res.locals.user.id;
  try {
    const request = await createRequest(userId, req.body.paymentSuccessful);
    return res.json(request).status(201);
  } catch (err) {
    console.log(err);
    return res.json("Internal Server Error").status(500);
  }
};

export const updateRequestHandler = async (
  req: Request<any, any, UpdateRequestSchema["body"]>,
  res: Response<any, { user: Claims }>,
) => {
  const requestId = req.params["requestId"];
  try {
    const request = await updateRequest(requestId, req.body.paymentSuccessful);
    if (!request) return res.json("request not found").status(404);
    return res.json(request);
  } catch (err) {
    console.log(err);
    return res.json("Internal server error");
  }
};
