import "dotenv/config";

export const dbConfig = {
  database: process.env.DB_NAME || "database",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  host: process.env.DB_HOST || "localhost",
  dialect: process.env.DB_DIALECT!,
};
