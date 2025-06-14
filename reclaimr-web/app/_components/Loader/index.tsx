import { cn } from "@/lib/utils"
import React, { HTMLAttributes } from "react"
import './Loader.module.css';

const Loader = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({className, ...props}, ref) => {
  return (
    <div ref={ref} {...props} className={cn("spinning-loader",className)}></div>
  )
});

Loader.displayName = 'Loader';
export default Loader;