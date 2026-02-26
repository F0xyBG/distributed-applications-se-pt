import 'dotenv/config';

export const DB_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

export const SALT_ROUNDS = 10;

export const COOKIE_LIFE = 3600000; // 1 hour

export const { PORT, HOST_NAME, NODE_ENV, CLIENT_ORIGIN, ACCESS_TOKEN_NAME, JWT_TOKEN_LIFE, ACCESS_TOKEN_SECRET } = process.env;
