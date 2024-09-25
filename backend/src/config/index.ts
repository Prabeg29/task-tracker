import path from "path";

import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../../.env")});

export default {
  app: {
    port    : process.env.APP_PORT || 3000,
    url     : process.env.NODE_ENV === "test" ? "http://localhost:3000" : process.env.APP_URL,
    logLevel: process.env.LOG_LEVEL || "info",
  },
  db: {
    client  : process.env.DB_CONNECTION || "mysql2",
    host    : process.env.NODE_ENV === "test" ? process.env.DB_TEST_HOST : process.env.DB_HOST,
    port    : process.env.DB_PORT || 3306,
    database: process.env.NODE_ENV === "test" ? process.env.DB_TEST_DATABASE : process.env.DB_DATABASE,
    user    : process.env.DB_USERNAME || "task-tracker",
    password: process.env.DB_PASSWORD || ""
  },
  permissions: [
    {
      "role"       : "super_admin",
      "permissions": ["create_tasks", "read_tasks", "update_tasks", "delete_tasks"]
    },
    {
      "role"       : "admin",
      "permissions": ["create_tasks", "read_tasks", "update_tasks"]
    },
    {
      "role"       : "member",
      "permissions": ["create_tasks", "read_tasks", "update_tasks"]
    }
  ],
  secrets: {
    jwt       : process.env.JWT_SECRET,
    refreshJwt: process.env.JWT_REFRESH_SECRET
  },
  google: {
    oauthClientId    : process.env.GOOGLE_OAUTH_CLIENT_ID,
    oauthClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    scopes           : process.env.GOOGLE_OAUTH_SCOPES,
    redirectUrl      : process.env.GOOGLE_OAUTH_CALLBACK_URL
  },
};
