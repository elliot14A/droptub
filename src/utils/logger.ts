import logger from "pino";
import dayjs from "dayjs";

export default logger({
  base: {
    pid: false,
  },
  transport: {
    target: "pino-pretty",
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});
