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
import { Upload, FileIcon } from "lucide-react"
import { storeFile } from "../utils/fileStorage"

interface DocumentUploadProps {
  onUpload: (fileId: string, fileName: string, fileType: string) => void
  translations: {
    uploadDocument: string
    selectFile: string
    upload: string
    cancel: string
  }
}

export function DocumentUpload({ onUpload, translations }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (file) {
      setIsUploading(true)
      try {
        const fileId = await storeFile(file)
        onUpload(fileId, file.name, file.type)
        setIsOpen(false)
        setFile(null)
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
          <DialogDescription>Select a file from your computer to upload.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
            <Button type="submit" disabled={!file || isUploading}>
              {isUploading ? "Uploading..." : translations.upload}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

