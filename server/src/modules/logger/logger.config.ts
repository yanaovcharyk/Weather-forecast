import * as winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const consoleLogsFormat = printf(
  ({ timestamp, level, context, message, trace, ...meta }) => {
    return `${timestamp} [${context}] ${level}: ${message} ${trace ? trace : ''} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  },
);

const filterByLogLevel = (level: string) =>
  winston.format((info) => {
    return info.level === level ? info : false;
  })();

const createFileTransport = (level: string, maxFiles = '14d') =>
  new winston.transports.DailyRotateFile({
    dirname: `logs/${level}`,
    filename: `%DATE%.${level}.log`,
    datePattern: 'YYYY-MM-DD',
    maxFiles,
    zippedArchive: true,
    format: combine(
      filterByLogLevel(level),
      timestamp(),
      errors({ stack: true }),
      json(),
    ),
  });

const consoleTransport = new winston.transports.Console({
  format: combine(colorize(), timestamp(), consoleLogsFormat),
});

export const winstonConfig = {
  level: 'debug',
  transports: [
    consoleTransport,

    createFileTransport('error'),
    createFileTransport('warn'),
    createFileTransport('info'),
    createFileTransport('debug', '7d'),
  ],
};
