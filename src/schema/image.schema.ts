import { TypeOf, z } from "zod";

export const createImageSchema = z.object({
  body: z.array(
    z.object({
      url: z
        .string({ required_error: "url is required" })
        .url({ message: "invalid url" }),
    }),
  ),
});

export const deleteImageSchema = z.object({
  params: z.object({
    imageId: z.string({ required_error: "imageId is required" }),
  }),
});

export const getAllImagesSchema = z.object({
  query: z.object({
    limit: z.number().optional(),
    page: z.number().optional(),
  }),
});

export type CreateImageSchema = TypeOf<typeof createImageSchema>;
export type DeleteImageSchema = TypeOf<typeof deleteImageSchema>;
export type GetAllImagesSchema = TypeOf<typeof getAllImagesSchema>;
