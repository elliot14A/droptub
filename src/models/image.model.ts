import mongoose from "mongoose";
import { v4 as uuid } from "uuid";
import { UserDocument } from "./user.model";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    imageId: {
      type: String,
      required: true,
      default: () => uuid(),
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export interface ImageInput {
  userId: UserDocument["_id"];
  url: string;
}

export interface ImageDocument extends ImageInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const ImageModel = mongoose.model<ImageDocument>("Image", imageSchema);
export default ImageModel;
