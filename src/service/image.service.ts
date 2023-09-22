import { FilterQuery, QueryOptions } from "mongoose";
import ImageModel, { ImageDocument, ImageInput } from "../models/image.model";
import { Pagition } from "../utils/pagination";

export async function getAllImagesOfAUser(
  query: FilterQuery<ImageDocument>,
  options: QueryOptions = { lean: true },
) {
  const total = await ImageModel.countDocuments(query);
  const images = await ImageModel.find(query, {}, options).sort({
    createdAt: "desc",
  });
  const response: Pagition<ImageDocument> = {
    total,
    data: images,
  };
  return response;
}

export async function createImage(input: ImageInput) {
  const image = await ImageModel.create(input);
  return image.toJSON();
}

export async function deleteImage(query: FilterQuery<ImageDocument>) {
  await ImageModel.findOneAndDelete(query);
}

export async function getImageById(
  query: FilterQuery<ImageDocument>,
  options: QueryOptions = { lean: true },
) {
  return await ImageModel.findOne(query, {}, options);
}
