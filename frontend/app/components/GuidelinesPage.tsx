"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface GuidelinesPageProps {
  title: string;
  description: string;
  guidelines: string[];
  onApply: () => void;
  translations: {
    applyNow: string;
    close: string;
  };
  children: React.ReactNode;
}

export function GuidelinesPage({ title, description, guidelines, onApply, translations, children }: GuidelinesPageProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ul className="list-disc pl-4 space-y-2">
            {guidelines.map((guideline, index) => (
              <li key={index}>{guideline}</li>
            ))}
          </ul>
        </div>
        <DialogFooter>
          <Button onClick={onApply}>{translations.applyNow}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

