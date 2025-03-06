import "reflect-metadata";
import { DataSource } from "typeorm";
import { DATABASE_URL } from "../config/env";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: DATABASE_URL,
  logging: false,
  entities: ["build/DB/entities/*.js"],
  subscribers: [],
  synchronize: true, 
});