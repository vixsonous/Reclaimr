import { db } from "../db/database";
import { InsertItemImageReturn, InsertItemReturn, NewItem, NewItemImage } from "../db/types";
import { ITEMS_SERVICE_LOGS } from "../service/items-service";
import { LogsService } from "../service/logs-service";

export class ItemRepository {
  static async itemTableInsert(newItem: NewItem): Promise<InsertItemReturn | null> {
    try {
      const itemInsertResult = await db.insertInto("item_table")
              .values(newItem)
              .returningAll()
              .executeTakeFirstOrThrow();

      return itemInsertResult;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export class ItemImageRepository {
  static async itemImageInsert(newItemImages: NewItemImage[]): Promise<InsertItemImageReturn[] | null> {
    try {
      const itemImageInsertResult = await db.insertInto("item_image_table")
        .values(newItemImages)
        .returningAll()
        .execute();
        
      return itemImageInsertResult;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}