"use client";
import Button from "@/app/_components/Button";
import Input from "@/app/_components/Input";
import Modal from "@/app/_components/Modal";
import { addMapItem } from "@/store/redux-slice/map-items-slice";
import { ICoordinates } from "@/types/map-types";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 } from "uuid";
import {FieldValues, useForm} from "react-hook-form";
import FileUploadInput from "./FileUploadInput";
import { ApiResponse, ItemApiService } from "@/lib/ApiService";
import { toast } from "sonner";

export default function FoundItemModal({
  setCoords
} : {
  setCoords: Dispatch<SetStateAction<ICoordinates>>;
}) {

  const dispatch = useDispatch();
  const {register, handleSubmit, watch, formState: {errors} } = useForm();
  const [submitCoords, setSubmitCoords] = useState<Partial<ICoordinates>>({
    latitude: undefined,
    longitude: undefined
  });
  
  const setLocation = () => {
    navigator.geolocation.getCurrentPosition((coords) => {
      setCoords({latitude: coords.coords.latitude, longitude: coords.coords.longitude});
      setSubmitCoords({latitude: coords.coords.latitude, longitude: coords.coords.longitude});
      dispatch(addMapItem({
        id: v4(),
        title: '',
        description: '',
        latitude: coords.coords.latitude, 
        longitude: coords.coords.longitude
      }));
    }); 
  }

  const getLocation = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    navigator.permissions.query({name: 'geolocation'}).then(res => {
      if(res.state === 'granted') {
        setLocation();
      }
    });
  }

  const onSubmit = async (data:FieldValues) => {
    console.log(submitCoords);
    if(!submitCoords.latitude || !submitCoords.longitude) {
      toast.error("Coordinates not set", {
        description: "Please click the confirm button location"
      })
      return;
    }

    const ret:boolean = await ItemApiService.uploadFoundItem({
      item_name: data.itemName,
      item_images: data.itemImages,
      coordinates: {
        latitude: submitCoords.latitude,
        longitude: submitCoords.longitude
      }
    });
  };

  const files:Record<string, File> = watch("itemImages");
  const f = files ? Object.keys(files).map(sFile => {
    const file = files[sFile];

    return URL.createObjectURL(file);
  }) : [];
  return (
    <Modal>
      <form onSubmit={handleSubmit(onSubmit)} action="">
        <Input {...register("itemName", {required: true, maxLength: 10})} placeholder="Name of the item"/>
        {errors.itemName && <span>{errors.itemName.message?.toString()}</span>}
        <FileUploadInput type="file" {...register("itemImages")}/>
        <section>
          <h1>Images Uploaded</h1>
          <div className="flex flex-row flex-wrap">
            {f.map(url => <img className="aspect-square object-cover" width={100} height={100} key={url} src={url}/>)}
          </div>
        </section>
        <Button onClick={getLocation}>
          Confirm location
        </Button>
        <Button>
          Submit
        </Button>
      </form>
    </Modal>
  )
}