"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface FamilyMember {
  name: string;
  relation: string;
  aadhar: string;
}

interface AddFamilyMemberProps {
  onAdd: (member: FamilyMember) => void;
  translations: {
    addFamilyMember: string;
    name: string;
    relation: string;
    aadharNumber: string;
    add: string;
    cancel: string;
  };
}

export function AddFamilyMember({ onAdd, translations }: AddFamilyMemberProps) {
  const [name, setName] = useState("")
  const [relation, setRelation] = useState("")
  const [aadhar, setAadhar] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({ name, relation, aadhar })
    setName("")
    setRelation("")
    setAadhar("")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{translations.addFamilyMember}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{translations.addFamilyMember}</DialogTitle>
          <DialogDescription>
            Add details of your family member here. Click add when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {translations.name}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relation" className="text-right">
                {translations.relation}
              </Label>
              <Input
                id="relation"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="aadhar" className="text-right">
                {translations.aadharNumber}
              </Label>
              <Input
                id="aadhar"
                value={aadhar}
                onChange={(e) => setAadhar(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{translations.add}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

