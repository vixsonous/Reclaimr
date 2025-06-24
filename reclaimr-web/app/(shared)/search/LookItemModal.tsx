import Button from "@/app/_components/Button";
import { CategoryComboBox } from "@/app/_components/CategoryComboBox";
import Input from "@/app/_components/Input";
import Modal from "@/app/_components/Modal";
import { ItemApiService } from "@/lib/ApiService";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

export default function LookItemModal() {
  const {register, handleSubmit} = useForm();
  const [category, setCategory] = useState("");
  
  const onSubmit = async (data: FieldValues) => {
    const result = await ItemApiService.searchFoundItem({
      item_name: data.itemName !== "" ? data.itemName : undefined,
      item_category: category !== "" ? category : undefined,
      item_description: data.itemDescription !== "" ? data.itemDescription : undefined,
    });

  }

  return (
    <Modal trigger={"Looking for an item?"}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Input {...register("itemName")}/>
        <Input {...register("itemDescription")}/>
        <CategoryComboBox valueParams={category} setValueParams={setCategory}/>
        <Button>
          Search
        </Button>
      </form>
    </Modal>
  )
}