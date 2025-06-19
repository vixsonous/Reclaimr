import Button from "@/app/_components/Button";
import { CategoryComboBox } from "@/app/_components/CategoryComboBox";
import Input from "@/app/_components/Input";
import Modal from "@/app/_components/Modal";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

export default function LookItemModal() {
  const {register, handleSubmit} = useForm();
  const [category, setCategory] = useState("");
  
  const onSubmit = (data: FieldValues) => {
    console.log(data);
  }

  return (
    <Modal trigger={"Looking for an item?"}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Input {...register("item_name")}/>
        <CategoryComboBox valueParams={category} setValueParams={setCategory}/>
        <Button>
          Search
        </Button>
      </form>
    </Modal>
  )
}