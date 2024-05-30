import { existsSync, mkdirSync } from 'fs';

import pino from 'pino';

import config from '../config';

const LOG_DIR = `${__dirname}/../../logs`;

if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR);
}

const logger = pino(
  {
    level: config.app.logLevel || 'info',
  },
  pino.transport({
    targets: [
      {
        target : 'pino-pretty',
        options: {
          colorize     : true,
          translateTime: 'SYS:mmm dd yyyy, h:MM:ss TT',
          ignore       : 'pid,hostname',
        }
      },
      {
        target : 'pino/file',
        options: { destination: `${LOG_DIR}/app.log` }
      }
    ]
  })
);

export default logger;
