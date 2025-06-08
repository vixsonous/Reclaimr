import { IMapItem } from "@/types/map-types";
import {createSlice, nanoid} from "@reduxjs/toolkit";

type AddMapItemAction = {
  payload: IMapItem,
  type: string;
}

const mapItemsSlice = createSlice({
  name: 'Map Items',
  initialState: [] as IMapItem[],
  reducers: {
    addMapItem(state, action: AddMapItemAction) {

      state.push(action.payload);
    }
  }
});

export const {addMapItem} = mapItemsSlice.actions;
export default mapItemsSlice.reducer;