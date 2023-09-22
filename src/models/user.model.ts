import mongoose from "mongoose";
import argon2 from "argon2";
import ImageModel from "./image.model";

export enum Tier {
  freemium = "freemium",
  premium = "premium",
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    subscriptionId: { type: String, default: () => "" },
    tier: {
      type: String,
      enum: Object.values(Tier),
      required: true,
      default: () => Tier.freemium,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function(next) {
  let user = this as UserDocument;
  if (!user.isModified("password")) {
    return next();
  }
  const hash = await argon2.hash(user.password, {});
  user.password = hash;
  return next();
});

userSchema.methods.checkPassword = async function(
  password: string,
): Promise<boolean> {
  const user = this as UserDocument;
  return argon2.verify(user.password, password).catch((_) => false);
};

userSchema.methods.canUploadNewImage = async function(): Promise<{
  canUpload: boolean;
  diffInMins: number;
}> {
  let user = this as UserDocument;
  if (user.tier === Tier.premium) return { canUpload: true, diffInMins: 0 };
  try {
    // get most recently uploaded image of the user
    const mostRecentUpload = await ImageModel.findOne({
      userId: user._id,
    }).sort({
      createdAt: "desc",
    });
    // hasn't uploaded any images yet
    if (!mostRecentUpload) {
      return { canUpload: true, diffInMins: 0 };
    }
    const currentTime = new Date();
    const uploadTime = mostRecentUpload.createdAt;
    const diff = currentTime.getTime() - uploadTime.getTime();
    const diffInHours = diff / (1000 * 60 * 60);
    return {
      canUpload: diffInHours > 1,
      diffInMins: 60 - Math.round(diffInHours * 60),
    };
  } catch {
    return { canUpload: false, diffInMins: 0 };
  }
};

const UserModel: mongoose.Model<UserDocument> = mongoose.model(
  "User",
  userSchema,
);

export interface UserInput {
  email: string;
  name: string;
  password: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  tier: Tier;
  subscriptionId: String;
  checkPassword(password: string): Promise<boolean>;
  canUploadNewImage(): Promise<{ canUpload: boolean; diffInMins: number }>;
}

export default UserModel;

// jan 1 they have brought the pro tier
// jan 15 they want to upgrade to the expert tier
// pro -> 20 credits
// expert -> 50 credits
// default -> 0 credits
