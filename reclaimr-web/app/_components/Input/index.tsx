import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React, { InputHTMLAttributes } from "react";
import { FieldErrors } from "react-hook-form";

const inputVariants = cva("m-0 p-0 box-content",
  {
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
  }
)

const Input = React.forwardRef<
  HTMLInputElement, 
  InputHTMLAttributes<HTMLInputElement> & 
  VariantProps<typeof inputVariants> & 
  {errors?: FieldErrors, field?: string}
>(
  ({children, variant, errors, field, size, className, ...props}, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <input className={cn({variant, size, className })} ref={ref} {...props} />
        {<span className="text-xs text-red-400 h-4">{errors && errors[field ?? ""]?.message?.toString()}</span>}
      </div>
    )
});

Input.displayName = "Input";
export default Input;