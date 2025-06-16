import { InsertItemReturn, ItemsCategory, NewItem } from "../db/types";
import { ItemsService } from "../service/items-service";

export class Item {
  private _item_name: string;
  private _item_category: ItemsCategory;
  private _found_latitude: number;
  private _found_longitude: number;
  private _found_by_anonymous: boolean;
  private _is_returned: boolean;
  private _found_by_user: number;

  constructor(
    item_name: string,
    item_category: ItemsCategory,
    found_latitude: number,
    found_longitude: number,
    found_by_anonymous: boolean,
    is_returned: boolean,
    found_by_user: number
  ) {
    this._item_name = item_name;
    this._item_category = item_category;
    this._found_latitude = found_latitude;
    this._found_longitude = found_longitude;
    this._found_by_anonymous = found_by_anonymous;
    this._is_returned = is_returned;
    this._found_by_user = found_by_user;
  }

  async create(): Promise<InsertItemReturn | null> {
    const newItem = {
      item_name: this._item_name,
      item_category: this._item_category,
      found_latitude: this._found_latitude,
      found_longitude: this._found_longitude,
      found_by_anonymous: this._found_by_anonymous,
      is_returned: this._is_returned,
      found_by_user: this._found_by_user
    } satisfies NewItem;
  
    const itemUploadResult = await ItemsService.uploadItemToDatabase(newItem);

    return itemUploadResult;
  }
}