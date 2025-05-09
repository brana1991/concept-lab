import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `[${timestamp}] ${level}: ${message}`;
  
  // Add metadata if present
  if (Object.keys(metadata).length > 0) {
    msg += `\n${JSON.stringify(metadata, null, 2)}`;
  }
  
  return msg;
});

// Create the logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        logFormat
      )
    })
  ]
});

export default logger; 