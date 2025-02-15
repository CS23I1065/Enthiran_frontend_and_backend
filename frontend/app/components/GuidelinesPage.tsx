import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface GuidelinesPageProps {
  title: string;
  description: string;
  guidelines: string[];
  applyUrl?: string;
  schemeName: string;
  translations: {
  viewGuidelines: string;
  applyNow: string;
  close: string;
  };
  onApply: (scheme: string) => void;
  children: React.ReactNode;
}

export function GuidelinesPage({
  title,
  description,
  guidelines,
  applyUrl,
  schemeName,
  translations,
  onApply,
  children,
}: GuidelinesPageProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleShowGuidelines = () => {
    setIsOpen(true);
  };

  const handleApply = () => {
    console.log("Scheme Name:", schemeName, "Apply URL:", applyUrl); // Debugging
  
    if (applyUrl) {
      window.open(applyUrl, "_blank");  // ✅ Open the correct scheme URL
    } else {
      onApply(schemeName);  // ✅ Call the function if URL is not provided
    }
    setIsOpen(false);
  };
  

  console.log("Scheme Name:", schemeName); // Debugging

  return (
    <div className="space-y-4">
      {/* Scheme Display */}
      <div className="border p-4 rounded-lg shadow-sm flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-semibold text-lg">{schemeName}</span>
          <span className="text-sm text-gray-600">{description}</span>
        </div>
        <Button onClick={handleShowGuidelines} className="bg-black text-white px-4 py-2 rounded-md">
          <span className="font-semibold">{translations.applyNow}</span>
        </Button>
      </div>

      {/* Guidelines Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{schemeName} - {title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ul className="list-disc pl-4 space-y-2">
              {guidelines.map((guideline, index) => (
                <li key={index}>{guideline}</li>
              ))}
            </ul>
            <DialogFooter>
              <Button onClick={handleApply} className="bg-black text-white px-4 py-2 rounded-md">
                <span className="font-semibold">{translations.applyNow}</span>
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
    <div className="space-y-4">
      {/* Scheme Display */}
      <div className="border p-4 rounded-lg shadow-sm flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-semibold text-lg">{schemeName}</span>
          <span className="text-sm text-gray-600">{description}</span>
        </div>
        <Button onClick={handleShowGuidelines} className="bg-black text-white px-4 py-2 rounded-md">
          <span className="font-semibold">{translations.applyNow}</span>
        </Button>
      </div>

      {/* Guidelines Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{schemeName} - {title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ul className="list-disc pl-4 space-y-2">
              {guidelines.map((guideline, index) => (
                <li key={index}>{guideline}</li>
              ))}
            </ul>
            <DialogFooter>
              <Button onClick={handleApply} className="bg-black text-white px-4 py-2 rounded-md">
                <span className="font-semibold">{translations.applyNow}</span>
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
}