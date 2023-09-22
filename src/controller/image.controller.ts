import { Request, Response } from "express";
import {
  CreateImageSchema,
  DeleteImageSchema,
  GetAllImagesSchema,
} from "../schema/image.schema";
import { Claims } from "../utils/jwt";
import {
  createImage,
  getImageById,
  deleteImage,
  getAllImagesOfAUser,
} from "../service/image.service";
import {
  canUploadImage,
  userCanUploadMultipleImages,
} from "../service/user.service";

export async function uploadImagesHandler(
  req: Request<any, any, CreateImageSchema["body"]>,
  res: Response<any, { user: Claims }>,
) {
  const userId = res.locals.user.id;
  if (!req.body.length)
    return res.status(400).json({ message: "no images provided" });
  try {
    if (req.body.length > 1) {
      const canUploadMultipleImages = await userCanUploadMultipleImages({
        userId,
      });
      if (!canUploadMultipleImages)
        return res.status(400).json({
          message: "please upgrade to premium tier to upload multiple images",
        });

      const imagePromises = req.body.map((image) => {
        return createImage({ userId, ...image });
      });
      const images = await Promise.all(imagePromises);
      return res.status(201).json(images);
    }
    const canUpload = await canUploadImage({ userId });
    if (!canUpload?.canUpload) {
      return res.status(400).json({
        message: `you can upload an image after ${canUpload?.diffInMins || 60
          } minutes`,
      });
    }
    const image = await createImage({ userId, ...req.body[0] });
    return res.status(201).json([image]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "something went wrong" });
  }
}

export async function deleteImageHandler(
  req: Request<DeleteImageSchema["params"]>,
  res: Response<any, { user: Claims }>,
) {
  const userId = res.locals.user.id;
  const imageId = req.params.imageId;
  try {
    const image = await getImageById({ imageId });
    if (!image) return res.status(404).json({ message: "image not found" });
    if (image.userId.toString() !== userId)
      return res.status(401).json({ message: "unauthorized" });
    await deleteImage({ imageId });
    return res.status(200).json({ message: "image deleted" });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
}

export async function getImagesHandler(
  _: Request<any, any, any, GetAllImagesSchema["query"]>,
  res: Response<any, { user: Claims }>,
) {
  const userId = res.locals.user.id;
  try {
    const images = await getAllImagesOfAUser({ userId });
    return res.status(200).json(images);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
}

export async function canUploadImageHandler(
  _: Request,
  res: Response<any, { user: Claims }>,
) {
  const userId = res.locals.user.id;
  try {
    const canUpload = await canUploadImage({ userId });
    return res.status(200).json(canUpload);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
}
