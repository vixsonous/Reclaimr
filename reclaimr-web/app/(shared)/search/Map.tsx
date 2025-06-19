"use client";
import { ICoordinates } from "@/types/map-types";
import { useMemo, useRef, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import FoundItemModal from "./FoundItemModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux-store/store";
import { UserResponse } from "@supabase/supabase-js";
import LookItemModal from "./LookItemModal";

export default function MapClient() {

  const mapref = useRef(null);
  const [coords, setCoords] = useState<ICoordinates>({
    latitude: 40.68985092532933,
    longitude: -73.98109555019138,
    zoom: 14
  });

  const items = useSelector((state: RootState) => state.mapItems);
  const markers = useMemo(() => items.map(i => <Marker key={i.id} longitude={i.longitude} latitude={i.latitude}/>), [items]);
  
  return (
    <>
    <Map 
        reuseMaps
        ref={mapref}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        {...coords}
        zoom={coords.zoom ? coords.zoom : 14}
        onMove={(evt) => setCoords(evt.viewState)}
        style={{width: 600, height: 400}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {markers}
      </Map>
      <FoundItemModal setCoords={setCoords}/>
      <LookItemModal />
    </>
  )
}