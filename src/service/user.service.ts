import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import UserModel, { Tier, UserDocument, UserInput } from "../models/user.model";
import { omit } from "lodash";

export async function createUser(input: UserInput) {
  try {
    const user = await UserModel.create({ ...input, tier: Tier.freemium });
    return omit(user.toJSON(), "password");
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return false;
  }

  const validPassword = await user.checkPassword(password);

  if (!validPassword) {
    return false;
  }

  return omit(user.toJSON(), "password");
}

export async function getUserById({ id }: { id: string }) {
  const user = await UserModel.findById(id);
  return omit(user?.toObject(), "password");
}

export async function userCanUploadMultipleImages({
  userId,
}: {
  userId: string;
}) {
  const user = await UserModel.findById(userId);
  return user?.tier === Tier.premium;
}

export async function canUploadImage({ userId }: { userId: string }) {
  const user = await UserModel.findById(userId);
  return await user?.canUploadNewImage();
}

export async function updateUser(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions = { lean: true },
) {
  const user = await UserModel.findOneAndUpdate(query, update, options);
  return user;
}
