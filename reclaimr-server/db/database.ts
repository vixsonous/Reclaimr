import { Database } from "./types";
import {Pool} from "pg";
import { Kysely, PostgresDialect } from "kysely";
import dotenv from 'dotenv';
dotenv.config();

const dialect = new PostgresDialect({
  pool: new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    max: 10
  })
});

export const db = new Kysely<Database>({dialect});