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
import { Upload } from 'lucide-react'

interface DocumentUploadProps {
  onUpload: (file: File) => void;
  translations: {
    uploadDocument: string;
    selectFile: string;
    upload: string;
    cancel: string;
  };
}

export function DocumentUpload({ onUpload, translations }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (file) {
      onUpload(file)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <Upload className="h-4 w-4 mr-2" />
          {translations.uploadDocument}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{translations.uploadDocument}</DialogTitle>
          <DialogDescription>
            Select a file from your computer to upload.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="document">{translations.selectFile}</Label>
              <Input id="document" type="file" onChange={handleFileChange} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!file}>{translations.upload}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

