"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getFile } from "../utils/fileStorage"

interface DocumentDetailsPopupProps {
  isOpen: boolean
  onClose: () => void
  documentId?: string | null
  title: string;
  translations: {
    close: string
    loading: string
    errorLoading: string
  }
}

export function DocumentDetailsPopup({ isOpen, onClose, documentId, translations }: DocumentDetailsPopupProps) {
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && documentId) {
      setIsLoading(true)
      setError(null)
      getFile(documentId)
        .then(async (file) => {
          if (file) {
            const content = await file.text()
            setFileContent(content)
          } else {
            setError("File not found")
          }
        })
        .catch((err) => {
          console.error("Error loading file:", err)
          setError("Failed to load file")
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setFileContent(null)
    }
  }, [isOpen, documentId])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{documentId ? `Document: ${documentId}` : "Document Details"}</DialogTitle>
          <DialogDescription>{isLoading ? translations.loading : error || "Document content:"}</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-red-500">{translations.errorLoading}</div>
        ) : (
          <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md">{fileContent}</pre>
        )}
        <div className="mt-6">
          <Button onClick={onClose}>{translations.close}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

