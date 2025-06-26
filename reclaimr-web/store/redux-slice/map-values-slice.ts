import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 coordinates: {
  latitude: 0,
  longitude: 0,
 } 
}


const mapValueSlice = createSlice({
  name: 'Map values',
  initialState: initialState,
  reducers: {
    setCoordinates(state, action) {
      state.coordinates = action.payload
    }
  }
});

export const {setCoordinates} = mapValueSlice.actions;
export default mapValueSlice.reducer;