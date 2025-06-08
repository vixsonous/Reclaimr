import Input from "@/app/_components/Input";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React, { InputHTMLAttributes } from "react";

const fileUploadVariants = cva("", {
  variants: {
    variant: {
      default: ""
    },
    size: {
      default: ""
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});

const FileUploadInput = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof fileUploadVariants>>(
  ({className, variant, ...props}, ref) => {
  return (
    <Input ref={ref} className={cn(fileUploadVariants({variant}))} type="file" multiple {...props}/>
  )
});

FileUploadInput.displayName = "FileUploadInput";

export default FileUploadInput;