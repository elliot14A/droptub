import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";
import logger from "../utils/logger";

export const validate =
  (schema: z.AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        return next();
      } catch (err) {
        if (err instanceof ZodError) {
          return res.status(400).json({
            message: formatZodErrors(err.errors),
          });
        }
        logger.error(err);
        return res.status(500).json({
          message: "internal server error",
        });
      }
    };

function formatZodErrors(errors: z.ZodIssue[]) {
  return errors.map((e) => {
    const { path, message } = e;
    return { field: path, error: message };
  });
}
