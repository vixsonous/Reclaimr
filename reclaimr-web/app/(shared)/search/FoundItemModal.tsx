"use client";
import Button from "@/app/_components/Button";
import Input from "@/app/_components/Input";
import Modal from "@/app/_components/Modal";
import { addMapItem } from "@/store/redux-slice/map-items-slice";
import { ICoordinates } from "@/types/map-types";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";
import {Control, FieldValues, useForm, useWatch} from "react-hook-form";
import FileUploadInput from "./FileUploadInput";
import { ApiResponse, ItemApiService } from "@/lib/ApiService";
import { toast } from "sonner";
import Loader from "@/app/_components/Loader";
import { CategoryComboBox } from "@/app/_components/CategoryComboBox";
import { UserResponse } from "@supabase/supabase-js";
import { RootState } from "@/store/redux-store/store";
import Signin from "./Signin";

function DisplayImages({control}: {control: Control}) {
  const files:Record<string, File> = useWatch({
    control,
    name: "itemImages"
  });

  const f = files ? Object.keys(files).map(sFile => {
    const file = files[sFile];

    return URL.createObjectURL(file);
  }) : [];
  
  return <section>
    <h1>Images Uploaded</h1>
    <div className="flex flex-row flex-wrap">
      {f.map(url => <img className="aspect-square object-cover" width={100} height={100} key={url} src={url}/>)}
    </div>
  </section>
}

export default function FoundItemModal({
  setCoords
} : {
  setCoords: Dispatch<SetStateAction<ICoordinates>>;
}) {

  const dispatch = useDispatch();
  const {register, handleSubmit, control, formState: {errors} } = useForm({
    mode: 'onChange'
  });
  const [submitCoords, setSubmitCoords] = useState<Partial<ICoordinates>>({
    latitude: undefined,
    longitude: undefined
  });
  const [category, setCategory] = React.useState("")

  
  const setLocation = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast("Retrieving location", {
      description: <h1>Retrieving location data. Please wait</h1>
    });
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

  const onSubmit = async (data:FieldValues) => {
    if(!submitCoords.latitude || !submitCoords.longitude) {
      toast.error("Coordinates not set", {
        description: "Please click the confirm button location"
      })
      return;
    }

    const ret:boolean = await ItemApiService.uploadFoundItem({
      item_name: data.itemName,
      item_category: category,
      item_description: data.itemDescription,
      item_images: data.itemImages,
      coordinates: {
        latitude: submitCoords.latitude,
        longitude: submitCoords.longitude
      }
    });
  };

  const userAuth: UserResponse | null = useSelector((state: RootState) => state.user.userSession);
  return (
    <Modal trigger={"Found an item?"}>
      {
        userAuth === null ? (
          <>
          <div>Log in to report your findings!</div>
          <Signin />
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} action="" className="flex flex-col">
            <Input errors={errors} field="itemName" {...register("itemName", {required: true, maxLength: {
              value: 50,
              message: "Item name should not exceed 50 characters!"
            }})} placeholder="Name of the item"/>
            <Input {...register("itemDescription", {required: true, maxLength: {
              value: 99,
              message: "Item description should not exceed 99 characters!"
            }})} placeholder="Description of the item"/>
            <CategoryComboBox valueParams={category} setValueParams={setCategory} />
            <FileUploadInput type="file" {...register("itemImages")}/>
            <DisplayImages control={control}/>
            <Button onClick={setLocation}>
              Confirm location <Loader />
            </Button>
            <Button role="submit">
              Submit
            </Button>
          </form>
        )
      }
    </Modal>
  )
}