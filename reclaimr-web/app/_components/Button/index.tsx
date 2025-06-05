import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React, { HTMLAttributes } from "react"

const buttonVariants = cva("m-0 p-0 bg-transparent box-content", {
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
})

const Button = React.forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>>(
  ({children, className, variant, size, ...props}, ref) => {
    return (
      <button className={cn(buttonVariants({variant, size, className}))} {...props}>{children}</button>
    )
});

Button.displayName = "Button"

export default Button;