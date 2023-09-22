import express from "express";
import http from "http";
import dotenv from "dotenv";
import { connect } from "./utils/db";
import logger from "./utils/logger";
import { initroutes } from "./routes";
import cors from "cors";
import morgan from "morgan";

async function main() {
  dotenv.config();
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin: ["http://localhost:3000"],
    }),
  );

  // connect to database
  await connect();
  app.use(
    morgan(":method :url :status :response-time ms - :res[content-length]"),
  );

  app.use("/api", initroutes());

  const PORT = process.env.PORT || 8080;
  const server = http.createServer(app);
  server.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
}

main();
