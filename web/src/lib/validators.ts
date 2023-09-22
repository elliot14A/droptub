import { z } from "zod";

const email = z.string({ required_error: "email is requird" }).email();

const password = z
  .string({ required_error: "password is required" })
  .min(6, "password should be atleast 6 chars long");

export const loginCredentialsSchema = z.object({
  email,
  password,
});

export const registerCredentialsSchema = z.object({
  email,
  password,
  name: z
    .string({ required_error: "name is required" })
    .min(3, "name should be atleast 3 chars long"),
});

export const createImageSchema = z.array(
  z.object({
    url: z
      .string({ required_error: "url is required" })
      .url({ message: "invalid url" }),
  }),
);

export type RegisterCredentials = z.infer<typeof registerCredentialsSchema>;
export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
export type CreateImageSchema = z.infer<typeof createImageSchema>;
