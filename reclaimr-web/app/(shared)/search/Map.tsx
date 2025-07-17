"use client";
import { ICoordinates, IMapItem } from "@/types/map-types";
import { createContext, RefObject, useContext, useMemo, useRef, useState } from "react";
import Map, { MapRef, Marker, Popup } from "react-map-gl/mapbox";
import FoundItemModal from "./FoundItemModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/redux-store/store";
import { UserResponse } from "@supabase/supabase-js";
import LookItemModal from "./LookItemModal";
import { setCoordinates, setMapRef } from "@/store/redux-slice/map-values-slice";
import ReImage from "@/app/_components/Image";

export const MapContext = createContext<RefObject<MapRef | null> | null>(null);

export default function MapClient() {

  const mapref = useRef<MapRef | null>(null);
  const [popupInfo, setPopupInfo] = useState<IMapItem | null>(null);
  const [coords, setCoords] = useState<ICoordinates>({
    latitude: 10.306618420552581,
    longitude: 123.8859975900146,
    zoom: 14
  });

  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.mapItems);
  const markers = useMemo(() => items.map(i => {
    return (
      <Marker 
        key={i.id} 
        longitude={i.longitude} 
        latitude={i.latitude}
        onClick={e => {
          e.originalEvent.stopPropagation();
          setPopupInfo(i);
          if(mapref && mapref.current) {
            mapref.current.flyTo({center: [i.longitude, i.latitude], duration: 1500})
          }
        }}
      >
      </Marker>
    )
  }), [items]);
  
  return (
    <MapContext.Provider value={mapref}>
      <Map 
        reuseMaps
        ref={(ref) => {
          mapref.current = ref;
        }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        {...coords}
        zoom={coords.zoom ? coords.zoom : 14}
        onMove={(evt) => {
          setCoords(evt.viewState);
          dispatch(setCoordinates({latitude: evt.viewState.latitude, longitude: evt.viewState.longitude}));
        }}
        style={{width: 600, height: 400}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {markers}
        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            onClose={() => setPopupInfo(null)}
          >
            <section className="flex flex-col gap-0.5 max-w-64">
              <h1>Item: {popupInfo.title}</h1>
              <p>Description: {popupInfo.description}</p>
              <ReImage src={"/user/adsasd"}/>
              {popupInfo.images && (
                <div className="images">
                  {popupInfo.images.map(i => {
                    return (
                      <ReImage src={i.s3_key}/>
                    )
                  })}
                </div>
              )}
            </section>
          </Popup>
        )}
      </Map>
      <FoundItemModal setCoords={setCoords}/>
      <LookItemModal />
    </MapContext.Provider>
  )
}