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

export default function FoundItemModal({
  setCoords
} : {
  setCoords: Dispatch<SetStateAction<ICoordinates>>;
}) {

  const dispatch = useDispatch();
  const {register, handleSubmit, watch, formState: {errors} } = useForm();
  const [fileUrls, setFileUrls] = useState<Array<string>>([]);
  
  const setLocation = () => {
    navigator.geolocation.getCurrentPosition((coords) => {
      setCoords({latitude: coords.coords.latitude, longitude: coords.coords.longitude});
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

  const onSubmit = (data:FieldValues) => {
    console.log(data);
    console.log(errors);
  };

  const files:Record<string, File> = watch("item_images");
  const f = files ? Object.keys(files).map(sFile => {
    const file = files[sFile];
    
    return URL.createObjectURL(file);
  }) : [];
  return (
    <Modal>
      <form onSubmit={handleSubmit(onSubmit)} className="w-4xl" action="">
        <Input {...register("itemName", {required: true, maxLength: 10})} placeholder="Name of the item"/>
        {errors.itemName && <span>{errors.itemName.message?.toString()}</span>}
        <Input {...register("timeFound")} placeholder="Time you found it"/>
        <FileUploadInput type="file" {...register("item_images")}/>
        <section>
          <h1>Images Uploaded</h1>
          <div className="flex max-w-4xl  flex-row flex-wrap">
            {f.map(url => <img key={url} src={url}/>)}
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