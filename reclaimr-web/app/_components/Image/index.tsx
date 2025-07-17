"use client";
import { ApiService } from "@/lib/ApiService";
import { queryClient } from "@/lib/utils";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import React, { HTMLAttributes, ImgHTMLAttributes } from "react";

const ReImage = React.forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement>>(
  ({...props}, ref) => {
    const getUrl = useQuery({
      queryKey: ['reimg', props.src],
      queryFn: () => ApiService.get("/api/signed-image?src=" + props.src),
      
    });
    console.log(getUrl);
  return (
    <img {...props} ref={ref}/>
  )
});

ReImage.displayName = "ReImage";


export default ReImage;