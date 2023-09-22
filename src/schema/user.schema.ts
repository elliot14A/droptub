import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "name is a required field" })
      .min(3, "name should be atleast 3 chars long"),
    password: z
      .string({ required_error: "password is a required field" })
      .min(6, "password should be atleast 6 chars long"),
    email: z.string({ required_error: "email is a required field" }).email(),
  }),
});

export const getUserByIdSchema = z.object({
  params: z.object({
    userId: z.string({ required_error: "userId is required" }),
  }),
});

export const subscriptionSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "email is required" }),
    subscriptionId: z.string().optional(),
  }),
});

export type CreateUserSchema = z.TypeOf<typeof createUserSchema>;
export type GetUserByIdSchema = z.TypeOf<typeof getUserByIdSchema>;
export type SubscriptionSchema = z.TypeOf<typeof subscriptionSchema>;
