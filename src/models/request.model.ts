import mongoose from "mongoose";
import { UserDocument } from "./user.model";

const requestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentSuccessful: { type: Boolean, default: () => false },
  },
  {
    timestamps: true,
  },
);

export interface RequestDocument extends mongoose.Document {
  user: UserDocument["_id"];
  paymentSuccessful: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const RequestModel = mongoose.model("Request", requestSchema);
