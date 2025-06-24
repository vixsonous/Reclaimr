import {
  ColumnType,
  Generated,
  JSONColumnType,
  Insertable,
  Selectable,
  Updateable
} from 'kysely';

export type ItemsCategory =
  "phone" | "wallet" | "keys" | "unknown";
export interface Database {
  item_table: ItemTable;
  item_image_table: ItemImageTable;
}

export interface ItemTable {
  id: Generated<number>;
  item_name: string;
  item_category: ItemsCategory;
  item_description: string;
  is_returned: boolean;
  found_latitude: number;
  found_longitude: number;
  found_by_anonymous: boolean;
  found_by_anonymous_contact?: JSONColumnType<{
    contact_name: string;
    contact_number: string;
  }>; // JSON
  found_by_user?: string;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}

export type Item = Selectable<ItemTable>;
export type NewItem = Insertable<ItemTable>;
export type UpdateItem = Updateable<ItemTable>;

export interface InsertItemReturn {
    id: number;
    item_name: string;
    item_category: ItemsCategory;
    item_description: string;
    is_returned: boolean;
    found_latitude: number;
    found_longitude: number;
    found_by_anonymous: boolean;
    found_by_anonymous_contact: {
        contact_name: string;
        contact_number: string;
    } | undefined;
    found_by_user: string | undefined;
    created_at: Date;
    updated_at: Date;
}

export interface ItemImageTable {
  id: Generated<number>;
  item_id: number;
  image_relative_path: string;
  image_owner_id: string;
  metadata: JSONColumnType<{
    lastModifiedDate: string;
    name: string;
  }>;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}

export type ItemImage = Selectable<ItemImageTable>;
export type NewItemImage = Insertable<ItemImageTable>;
export type UpdateItemImage = Updateable<ItemImageTable>;

export interface InsertItemImageReturn {
    id: number;
    created_at: Date;
    updated_at: Date;
    item_id: number;
    image_relative_path: string;
    image_owner_id: string;
    metadata: {
        lastModifiedDate: string;
        name: string;
    };
}