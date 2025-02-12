import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DocumentDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  translations: {
    close: string;
  };
}

export function DocumentDetailsPopup({ isOpen, onClose, title, translations }: DocumentDetailsPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            This is a placeholder for the document details. In a real application, you would display relevant information about the document here.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Button onClick={onClose}>{translations.close}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

