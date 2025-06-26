import { Expression, sql, SqlBool } from "kysely";
import { db } from "../db/database";
import { InsertItemImageReturn, InsertItemReturn, ItemsCategory, NewItem, NewItemImage } from "../db/types";
import { ITEMS_SERVICE_LOGS } from "../service/items-service";
import { LogsService } from "../service/logs-service";

const ITEM_REPOSITORY_LOGS = {
  FIND_ITEM_ERROR: "There was an error looking for an item!",
  FIND_ITEM_SUCCESS: "Successfully found an item!",
}

const SEARCH_AREA_RADIUS = 0.1;

export interface ItemSearchFields {
  id?: number;
  item_name?: string;
  item_description?: string;
  item_category?: ItemsCategory;
  search_this_area?: boolean;
  location?: {
    latitude: number;
    longitude: number;
  } | undefined;
}
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

  static async itemSearch(search: ItemSearchFields): Promise<InsertItemReturn[] | null> {
    try {
      const searchItemResult = await db.selectFrom("item_table")
        .selectAll()
        .$if(search.id !== undefined, (qb) => qb.where("item_table.id",'=', search.id!))
        .$if(search.item_category !== undefined, (qb) => qb.where("item_table.item_category", "=", search.item_category!))
        .$if(search.item_name !== undefined, (qb) => qb.where("item_table.item_name", "like", `%${search.item_name}%`))
        .$if(search.item_description !== undefined, (qb) => qb.where(eb => {
          const ands:Expression<SqlBool>[] = [];
          
          if(!search.item_description) {

            return eb.and(ands);
          }
          const word_array = search.item_description.split(" ");
          word_array.forEach(word => {
            ands.push(eb("item_table.item_description", "like", `%${word}%`));
          });

          return eb.and(ands);
        }))
        .$if(search.search_this_area === true, qb => qb.where( ({eb, ref}) => {
          const ands: Expression<SqlBool>[] = [];
          if(search.location === undefined) {
            return eb.and(ands);
          }

          const upperLongitudeLimit = search.location.longitude + SEARCH_AREA_RADIUS;
          const lowerLongitudeLimit = search.location.longitude - SEARCH_AREA_RADIUS;
          const upperLatitudeLimit = search.location.latitude + SEARCH_AREA_RADIUS;
          const lowerLatitudeLimit = search.location.latitude - SEARCH_AREA_RADIUS;
          ands.push(
            eb("item_table.found_longitude", "<=", upperLongitudeLimit).and("item_table.found_longitude", ">=", lowerLongitudeLimit)
            .and("item_table.found_latitude", "<=", upperLatitudeLimit).and("item_table.found_latitude", ">=", lowerLatitudeLimit)
          );
          console.log(ands);
          return eb.and(ands);
        }))
        .execute();

      LogsService.log(ITEM_REPOSITORY_LOGS.FIND_ITEM_SUCCESS);
      return searchItemResult;
    } catch(error) {
      LogsService.error(ITEM_REPOSITORY_LOGS.FIND_ITEM_ERROR);
      console.error(error);
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