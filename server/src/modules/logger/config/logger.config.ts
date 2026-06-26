import { ConfigService } from '@nestjs/config';
import { format, transports } from 'winston';

import 'winston-daily-rotate-file';
import { IAppConfig } from '@shared/types';

const { combine, timestamp, errors, json, colorize, printf } = format;

const consoleLogsFormat = printf(
  ({ timestamp, level, context, message, trace, ...meta }) => {
    return [
      `${timestamp}`,
      context ? `[${context}]` : '[App]',
      `${level}:`,
      message,
      trace ?? '',
      Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : '',
    ].join(' ');
  },
);

const filterByLogLevel = (level: string) =>
  format((info) => {
    return info.level === level ? info : false;
  })();

const filterBySource = (source: 'server' | 'client') =>
  format((info) => {
    return info.source === source ? info : false;
  })();

const createServerFileTransport = (level: string, maxFiles = '14d') =>
  new transports.DailyRotateFile({
    dirname: `logs/server/${level}`,
    filename: `%DATE%.${level}.log`,
    datePattern: 'YYYY-MM-DD',
    maxFiles,
    zippedArchive: true,
    format: combine(
      filterBySource('server'),
      filterByLogLevel(level),
      timestamp(),
      errors({
        stack: true,
      }),
      json(),
    ),
  });

const createClientFileTransport = (level: string, maxFiles = '14d') =>
  new transports.DailyRotateFile({
    dirname: `logs/client/${level}`,
    filename: `%DATE%.${level}.log`,
    datePattern: 'YYYY-MM-DD',
    maxFiles,
    zippedArchive: true,
    format: combine(
      filterBySource('client'),
      filterByLogLevel(level),
      timestamp(),
      errors({
        stack: true,
      }),
      json(),
    ),
  });

const createConsoleTransport = () => new transports.Console({
  format: combine(
    colorize(),
    timestamp(),
    consoleLogsFormat,
  ),
});

export const winstonConfig = (config: ConfigService<IAppConfig>) => {
  const isDev = config.get('nodeEnv', { infer: true }) === 'development';

  return {
  level: 'debug',
  defaultMeta: {
    source: 'server',
  },

  transports: [
    ...(isDev ? [createConsoleTransport()] : []),
    createServerFileTransport('error'),
    createServerFileTransport('warn'),
    createServerFileTransport('info'),
    createServerFileTransport('debug', '7d'),
    createClientFileTransport('error'),
    createClientFileTransport('warn'),
    createClientFileTransport('info'),
    createClientFileTransport('debug', '7d'),
  ],
};
};
