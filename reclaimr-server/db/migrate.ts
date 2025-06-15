import { Kysely, Migration, MigrationProvider, Migrator, PostgresDialect } from "kysely";
import { fileURLToPath } from "url";
import * as path from 'path';
import { promises as fs } from 'fs';
import { Pool } from "pg";
import { Database } from "./types";
import dotenv from 'dotenv';
dotenv.config();

class ESMFileMigrationProvider implements MigrationProvider {
  constructor(private relativePath: string) { }

  async getMigrations(): Promise<Record<string, Migration>> {
      const migrations: Record<string, Migration> = { };
      const __dirname = fileURLToPath(new URL(".", import.meta.url));
      const resolvedPath = path.resolve(__dirname, this.relativePath);
      const files = await fs.readdir(resolvedPath);
      for (const fileName of files) {
          if (!fileName.endsWith(".ts")) {
              continue;
          }

          const importPath = path.join(resolvedPath, fileName).replaceAll("\\", "/");
          const migration = await import("file://" + importPath);
          const migrationKey = fileName.substring(0, fileName.lastIndexOf("."));
          migrations[migrationKey] = migration;
      }

      return migrations;
  }
}

async function migrateToLatest() {
  const dialect = new PostgresDialect({
    pool: new Pool({
      host: "localhost",
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      max: 10
    })
  });
  
  const db = new Kysely<Database>({dialect});
  const migrator = new Migrator({
    db: db,
    provider: new ESMFileMigrationProvider("migrations")
  });

  const {error, results} = await migrator.migrateToLatest();

  results?.forEach(it => {
    if(it.status === 'Success') {
      console.log(`Migration: ${it.migrationName} was excecuted successfuly!`);
    } else if(it.status === "Error") {
      console.error(`Migration: ${it.migrationName} failed to execute`);
    }
  })

  if(error) {
    console.log('Failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();