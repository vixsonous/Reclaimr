import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React, { HTMLAttributes } from "react";

const textVariant = cva("m-0 p-0 box-content", {
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
    size: 'default'
  }
});

const Text = React.forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof textVariant>>(
  ({children, variant, size, className, ...props}, ref) => {
  return (
    <p 
    className={cn({variant, size, className})}
    {...props}>{children}</p>
  )
});

Text.displayName = "Text";
export default Text;