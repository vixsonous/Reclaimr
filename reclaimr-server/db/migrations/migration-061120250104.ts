import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("item_table")
    .addColumn("id","serial", (col) => col.primaryKey())
    .addColumn("item_name", "varchar", (col) => col.notNull().defaultTo("unidentified item"))
    .addColumn("item_category", "varchar", (col) => col.notNull().defaultTo("unknown"))
    .addColumn("is_returned", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("found_latitude", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("found_longitude", "double precision", (col) => col.notNull().defaultTo(0))
    .addColumn("found_by_anonymous", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("found_by_anonymous_contact", "json", (col) => col.defaultTo(JSON.stringify({})))
    .addColumn("found_by_user", "integer", (col) => col.notNull().defaultTo(-1))
    .addColumn("created_at","timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at","timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .execute()

  await db.schema
    .createTable("item_image_table")
    .addColumn("id","serial", (col) => col.primaryKey())
    .addColumn("item_id", "integer", (col) => col.notNull().defaultTo(-1))
    .addColumn("image_url", "varchar", (col) => col.notNull())
    .addColumn("image_relative_path", "varchar", (col) => col.notNull())
    .addColumn("image_owner_id", "integer", (col) => col.notNull().defaultTo(-1))
    .addColumn("metadata", "json", (col) => col.defaultTo(JSON.stringify({})))
    .addColumn("created_at","timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at","timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .execute()
}