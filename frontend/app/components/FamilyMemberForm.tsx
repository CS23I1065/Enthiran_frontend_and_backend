"use client"

import { useState, useEffect } from "react"
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
  id: string;
  name: string;
  relation: string;
  aadhar: string;
}

interface FamilyMemberFormProps {
  member?: FamilyMember;
  onSave: (member: FamilyMember) => void;
  translations: {
    addFamilyMember: string;
    editFamilyMember: string;
    name: string;
    relation: string;
    aadharNumber: string;
    save: string;
    cancel: string;
  };
  children: React.ReactNode;
}

export default function FamilyMembers() {
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    const savedMembers = localStorage.getItem("familyMembers");
    return savedMembers ? JSON.parse(savedMembers) : [];
  });

  useEffect(() => {
    localStorage.setItem("familyMembers", JSON.stringify(members));
  }, [members]);

  const handleSave = (member: FamilyMember) => {
    const existingMemberIndex = members.findIndex(m => m.id === member.id);
    
    if (existingMemberIndex >= 0) {
      const updatedMembers = [...members];
      updatedMembers[existingMemberIndex] = member;
      setMembers(updatedMembers);
    } else {
      setMembers([...members, member]);
    }
  };

  const FamilyMemberForm = ({ member, onSave, translations, children }: FamilyMemberFormProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState(member?.name || "")
    const [relation, setRelation] = useState(member?.relation || "")
    const [aadhar, setAadhar] = useState(member?.aadhar || "")

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
    }, [member, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newMember: FamilyMember = {
        id: member?.id || Date.now().toString(),
        name,
        relation,
        aadhar
      };
      onSave(newMember);
      setIsOpen(false);
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{member ? translations.editFamilyMember : translations.addFamilyMember}</DialogTitle>
            <DialogDescription>
              {member ? "Edit the details of your family member here." : "Add details of your family member here."} Click save when you're done.
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
                  required
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
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{translations.save}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Family Members</h1>
        <FamilyMemberForm
          onSave={handleSave}
          translations={{
            addFamilyMember: "Add Family Member",
            editFamilyMember: "Edit Family Member",
            name: "Name",
            relation: "Relation",
            aadharNumber: "Aadhar Number",
            save: "Save",
            cancel: "Cancel",
          }}
        >
          <Button>Add Family Member</Button>
        </FamilyMemberForm>
      </div>

      <div className="space-y-2">
        {members.map(member => (
          <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-gray-500">
                {member.relation} • Aadhar: {member.aadhar}
              </p>
            </div>
            <FamilyMemberForm
              member={member}
              onSave={handleSave}
              translations={{
                addFamilyMember: "Add Family Member",
                editFamilyMember: "Edit Family Member",
                name: "Name",
                relation: "Relation",
                aadharNumber: "Aadhar Number",
                save: "Save",
                cancel: "Cancel",
              }}
            >
              <Button variant="outline" size="sm">Edit</Button>
            </FamilyMemberForm>
          </div>
        ))}
      </div>
    </div>
  );
}