import { IMapItem } from "@/types/map-types";
import {createSlice, nanoid} from "@reduxjs/toolkit";

type AddMapItemAction = {
  payload: IMapItem | IMapItem[],
  type: string;
}

const mapItemsSlice = createSlice({
  name: 'Map Items',
  initialState: [] as IMapItem[],
  reducers: {
    addMapItem(state, action: AddMapItemAction) {

      const existing = new Set();
      if(Array.isArray(action.payload)) {
        state = state.concat(action.payload).filter(el => {
          const duplicate = existing.has(el.id);
          existing.add(el.id);
          return !duplicate;
        });
      } else {
        state.push(action.payload);
      }
      
      return state;
    }
  }
});

export const {addMapItem} = mapItemsSlice.actions;
export default mapItemsSlice.reducer;