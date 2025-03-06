"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface OCRResultsEditorProps {
  isOpen: boolean
  onClose: () => void
  initialData: Record<string, string>
  onSave: (data: Record<string, string>) => void
  translations: {
    editOCRResults: string
    save: string
    cancel: string
  }
}

export function OCRResultsEditor({ isOpen, onClose, initialData, onSave, translations }: OCRResultsEditorProps) {
  const [editedData, setEditedData] = useState(initialData)

  const handleInputChange = (key: string, value: string) => {
    setEditedData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave(editedData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{translations.editOCRResults}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Object.entries(editedData).map(([key, value]) => (
            <div key={key} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={key} className="text-right">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Label>
              <Input
                id={key}
                value={value}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="col-span-3"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            {translations.cancel}
          </Button>
          <Button onClick={handleSave}>{translations.save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

