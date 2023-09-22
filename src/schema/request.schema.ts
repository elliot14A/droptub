import { z } from "zod";

export const updateRequestSchema = z.object({
  body: z.object({
    paymentSuccessful: z.boolean({
      required_error: "paymentSuccessful field is required",
    }),
  }),
});

export type UpdateRequestSchema = z.TypeOf<typeof updateRequestSchema>;
