import Button from "@/app/_components/Button";
import { CategoryComboBox } from "@/app/_components/CategoryComboBox";
import Input from "@/app/_components/Input";
import Modal from "@/app/_components/Modal";
import { ItemApiService } from "@/lib/ApiService";
import { addMapItem } from "@/store/redux-slice/map-items-slice";
import { RootState } from "@/store/redux-store/store";
import { IMapItem } from "@/types/map-types";
import { useContext, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { MapContext } from "./Map";
import { toast } from "sonner";

export default function LookItemModal() {
  const map = useContext(MapContext);
  const {register, handleSubmit} = useForm();
  const [category, setCategory] = useState("");
  const dispatch = useDispatch();

  const coordinates = useSelector((state: RootState) => state.mapValues.coordinates);
  
  const onSubmit = async (data: FieldValues) => {
    const result = await ItemApiService.searchFoundItem({
      item_name: data.itemName !== "" ? data.itemName : undefined,
      item_category: category !== "" ? category : undefined,
      item_description: data.itemDescription !== "" ? data.itemDescription : undefined,
      search_this_area: data.searchThisArea,
      location: coordinates
    });

    if(result.length > 0 && map && map.current) {
      const mapItems = result.map(m => ({
        id: String(m.id),
        title: m.item_name,
        description: m.item_description,
        latitude: m.found_latitude,
        longitude: m.found_longitude
      } satisfies IMapItem));

      dispatch(addMapItem(mapItems));

      map.current.flyTo({center: [mapItems[0].longitude, mapItems[0].latitude], duration: 2000});
    } else {
      toast.error("No Items found!", {
        description: "There were no items found while searching."
      })
      return;
    }

    
  }

  return (
    <Modal trigger={"Looking for an item?"}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Input {...register("itemName")}/>
        <Input {...register("itemDescription")}/>
        <Input type="checkbox" {...register("searchThisArea")}/>
        <CategoryComboBox valueParams={category} setValueParams={setCategory}/>
        <Button>
          Search
        </Button>
      </form>
    </Modal>
  )
}