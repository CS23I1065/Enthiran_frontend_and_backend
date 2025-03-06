"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

interface FamilyMember {
  id: string
  name: string
  relation: string
  aadhar: string
}

interface FamilyMemberFormProps {
  member?: FamilyMember
  onSave: (member: FamilyMember) => void
  onDelete?: (id: string) => void
  translations: {
    addFamilyMember: string
    editFamilyMember: string
    name: string
    relation: string
    aadharNumber: string
    save: string
    cancel: string
    delete?: string
  }
  children: React.ReactNode
}

const RELATION_OPTIONS = [
  "grandfather", 
  "grandmother", 
  "mother", 
  "father", 
  "son", 
  "daughter", 
  "spouse", 
  "brother", 
  "sister"
]

export function FamilyMemberForm({ 
  member, 
  onSave, 
  onDelete, 
  translations, 
  children 
}: FamilyMemberFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(member?.name || "")
  const [relation, setRelation] = useState(member?.relation || "")
  const [aadhar, setAadhar] = useState(member?.aadhar || "")
  const [aadharError, setAadharError] = useState("")

  useEffect(() => {
    if (member) {
      setName(member.name)
      setRelation(member.relation)
      setAadhar(member.aadhar)
    } else {
      setName("")
      setRelation("")
      setAadhar("")
    }
    // Reset error when form opens/changes
    setAadharError("")
  }, [member])

  const validateAadhar = (aadharNumber: string) => {
    const aadharRegex = /^\d{12}$/
    if (!aadharRegex.test(aadharNumber)) {
      setAadharError("Aadhar number must be exactly 12 digits")
      return false
    }
    setAadharError("")
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    if (!name.trim()) {
      alert("Please enter a name")
      return
    }

    if (!relation) {
      alert("Please select a relation")
      return
    }

    if (!validateAadhar(aadhar)) {
      return
    }

    const newMember: FamilyMember = {
      id: member?.id || Date.now().toString(),
      name: name.trim(),
      relation: relation,
      aadhar: aadhar.trim(),
    }

    onSave(newMember)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {member ? translations.editFamilyMember : translations.addFamilyMember}
          </DialogTitle>
          <DialogDescription>
            {member 
              ? "Edit the details of your family member here." 
              : "Add details of your family member here."
            } Click save when you're done.
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
                required 
                placeholder="Enter full name"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relation" className="text-right">
                {translations.relation}
              </Label>
              <Select 
                value={relation} 
                onValueChange={setRelation}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select relation" />
                </SelectTrigger>
                <SelectContent>
                  {RELATION_OPTIONS.map((relationOption) => (
                    <SelectItem key={relationOption} value={relationOption}>
                      {relationOption.charAt(0).toUpperCase() + relationOption.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="aadhar" className="text-right">
                {translations.aadharNumber}
              </Label>
              <div className="col-span-3">
                <Input
                  id="aadhar"
                  value={aadhar}
                  onChange={(e) => {
                    // Only allow numeric input
                    const numericValue = e.target.value.replace(/\D/g, '')
                    setAadhar(numericValue)
                    validateAadhar(numericValue)
                  }}
                  className="w-full"
                  required
                  maxLength={12}
                  placeholder="12-digit Aadhar number"
                />
                {aadharError && (
                  <p className="text-red-500 text-sm mt-1">{aadharError}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            {member && onDelete && translations.delete && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  onDelete(member.id)
                  setIsOpen(false)
                }}
                className="mr-auto"
              >
                {translations.delete}
              </Button>
            )}
            <Button type="submit">{translations.save}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}