import { createSlice } from "@reduxjs/toolkit";
import { Ref, RefObject } from "react";
import { MapRef } from "react-map-gl/mapbox";

const initialState: {
  mapRef: RefObject<MapRef> | null,
  coordinates: {
    latitude: number,
    longitude: number
  }
} = {
  mapRef: null,
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
    },
    setMapRef(state, action) {
      state.mapRef = action.payload
    }
  }
});

export const {setCoordinates, setMapRef} = mapValueSlice.actions;
export default mapValueSlice.reducer;