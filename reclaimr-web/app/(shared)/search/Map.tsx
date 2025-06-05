"use client";
import Button from "@/app/_components/Button";
import { ICoordinates } from "@/types/map-types";
import { useState } from "react";
import Map from "react-map-gl/mapbox";

export default function MapClient() {

  const [coords, setCoords] = useState<ICoordinates>({
    latitude: 37.8,
    longitude: -122.4
  })
  
  const showLocation = () => {
    navigator.geolocation.getCurrentPosition((loc) => {
      console.log(loc);
      setCoords({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      });

    });
  }
  return (
    <>
    <Map 
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      {...coords}
      zoom={14}
      onMove={(evt) => setCoords(evt.viewState)}
      style={{width: 600, height: 400}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
    <Button onClick={showLocation}>
      Found an item?
    </Button>
    </>
  )
}