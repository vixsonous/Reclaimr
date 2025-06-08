import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React, { InputHTMLAttributes } from "react";

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

const Input = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>>(
  ({children, variant, size, className, ...props}, ref) => {
    return (
      <input className={cn({variant, size, className })} ref={ref} {...props} />
    )
});

Input.displayName = "Input";
export default Input;