import mongoose from "mongoose";
import logger from "./logger";

export async function connect() {
  const dbUri = process.env.MONGO_URI;
  if (!dbUri) {
    logger.error("mongo uri not provided");
    process.exit();
  }

  try {
    await mongoose.connect(dbUri);
    logger.info("connected to mongodb");
  } catch (err) {
    logger.error(err);
    process.exit();
  }
}
