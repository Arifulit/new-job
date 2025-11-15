// ...existing code...
import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ timestamp, level, message, stack }) => {
  const msg = stack ?? message;
  return `${timestamp} [${level}]: ${msg}`;
});

const level = process.env.NODE_ENV === "production" ? "info" : "debug";

const logger = winston.createLogger({
  level,
  format: combine(timestamp(), errors({ stack: true }), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), errors({ stack: true }), logFormat),
    }),
  ],
  exitOnError: false,
});

// add file transports in production (optional)
if (process.env.NODE_ENV === "production") {
  logger.add(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    })
  );
  logger.add(
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10,
    })
  );
}

// morgan compatible stream
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;
// ...existing code...