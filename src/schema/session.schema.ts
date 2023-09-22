import { TypeOf, z } from "zod";

export const createSessionSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "email is required field" }).email(),
    password: z.string({ required_error: "password is required field" }),
  }),
});

export type CreateSessionSchema = TypeOf<typeof createSessionSchema>;
