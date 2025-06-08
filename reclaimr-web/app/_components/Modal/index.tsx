import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import React from "react"
import Button from "../Button"

export default function Modal({
  children,
  trigger=undefined,
  title="",
  description="",
  cancel="Cancel",
  close=undefined
}: {
  children: React.ReactNode,
  trigger?: React.ReactNode,
  title?: string,
  description?:string,
  cancel?:string,
  close?: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger>
        {trigger? trigger: "Open"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button className="cursor-pointer">{cancel}</Button>
          </DialogClose>
          {close}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}