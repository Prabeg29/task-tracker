import path from 'path';

import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env')});

export default {
  app: {
    port    : process.env.APP_PORT || 3000,
    url     : process.env.NODE_ENV === 'test' ? 'http://localhost:3000' : process.env.APP_URL,
    logLevel: process.env.LOG_LEVEL || 'info',
  },
  db: {
    client  : process.env.DB_CONNECTION || 'mysql2',
    host    : process.env.NODE_ENV === 'test' ? process.env.DB_TEST_HOST : process.env.DB_HOST,
    port    : process.env.DB_PORT || 3306,
    database: process.env.NODE_ENV === 'test' ? process.env.DB_TEST_DATABASE : process.env.DB_DATABASE,
    user    : process.env.DB_USERNAME || 'task-tracker',
    password: process.env.DB_PASSWORD || ''
  },
  secrets: {
    jwt: process.env.JWT_SECRET,
  }
};
