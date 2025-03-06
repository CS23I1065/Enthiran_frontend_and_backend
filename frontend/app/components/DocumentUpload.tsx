"use client"

import type React from "react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileIcon } from "lucide-react"
import { storeFile } from "../utils/fileStorage"

interface FamilyMember {
  id: string
  name: string
  relation: string
}

interface DocumentUploadProps {
  onUpload: (fileId: string, fileName: string, fileType: string, familyMemberId: string) => void
  familyMembers: FamilyMember[]
  translations: {
    uploadDocument: string
    selectFile: string
    upload: string
    cancel: string
    selectFamilyMember: string
  }
}

export function DocumentUpload({ onUpload, familyMembers, translations }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (file && selectedFamilyMember) {
      setIsUploading(true)
      try {
        const fileId = await storeFile(file)
        onUpload(fileId, file.name, file.type, selectedFamilyMember)
        setIsOpen(false)
        setFile(null)
        setSelectedFamilyMember("")
      } catch (error) {
        console.error("Error uploading file:", error)
        // Handle error (e.g., show error message to user)
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full py-8 text-lg">
          <Upload className="mr-2 h-6 w-6" />
          {translations.uploadDocument}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{translations.uploadDocument}</DialogTitle>
          <DialogDescription>Select a file and family member to upload.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="familyMember">{translations.selectFamilyMember}</Label>
              <Select value={selectedFamilyMember} onValueChange={setSelectedFamilyMember}>
                <SelectTrigger>
                  <SelectValue placeholder={translations.selectFamilyMember} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="myself">Myself</SelectItem>
                  {familyMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.relation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="document">{translations.selectFile}</Label>
              <div className="flex items-center gap-2">
                <Input id="document" type="file" onChange={handleFileChange} className="flex-grow" />
                {file && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <FileIcon className="h-4 w-4" />
                    {file.name}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              {translations.cancel}
            </Button>
            <Button type="submit" disabled={!file || !selectedFamilyMember || isUploading}>
              {isUploading ? "Uploading..." : translations.upload}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

