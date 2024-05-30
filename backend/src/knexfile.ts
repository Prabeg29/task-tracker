import path from 'path';

import config from './config';

export default {
  client    : config.db.client,
  connection: {
    host    : config.db.host,
    port    : config.db.port,
    user    : config.db.user,
    password: config.db.password,
    database: config.db.database,
  },
  migrations: {
    directory: path.join(__dirname, 'database/migrations'),
    tableName: 'migrations',
    extension: 'ts'
  },
  seeds: {
    directory: path.join(__dirname, 'database/seeds'),
    extension: 'ts'
  },
};
