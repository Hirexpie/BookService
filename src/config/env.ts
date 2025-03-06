import dotenv from "dotenv";

dotenv.config();


// connect
export const DATABASE_URL = process.env.DATABASE_URL || ''

// setings
export const PORT_APP = process.env.PORT_APP || 4000;

// tokens
export const ACCESS_SECRET = process.env.ACCESS_SECRET || "default-access-secret";
export const REFRESH_SECRET = process.env.REFRESH_SECRET || "default-refresh-secret";

export const ACCESS_EXPIRES = (process.env.ACCESS_EXPIRES || "15m") as string;
export const REFRESH_EXPIRES = (process.env.REFRESH_EXPIRES || "7d") as string;

// Проверка, чтобы избежать ошибок
if (!process.env.ACCESS_SECRET) {
  console.warn("⚠️ ACCESS_SECRET не задан в .env! Используется значение по умолчанию.");
}

if (!process.env.REFRESH_SECRET) {
  console.warn("⚠️ REFRESH_SECRET не задан в .env! Используется значение по умолчанию.");
}