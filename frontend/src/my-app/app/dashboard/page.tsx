"use client"

import { useState, useEffect, useCallback } from "react"
import { Bell, Search, Users, Pencil, Trash2, Plus, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FamilyMemberForm } from "../components/FamilyMemberForm"
import { SchemeDiscoveryChat } from "../components/SchemeDiscoveryChat"
import { DocumentUpload } from "../components/DocumentUpload"
import { GuidelinesPage } from "../components/GuidelinesPage"
import { useToast } from "@/components/ui/use-toast"
import { DocumentDetailsPopup } from "../components/DocumentDetailsPopup"

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  aadhar: string;
}

const translations = {
  english: {
    title: "En-Thiran Citizen Services",
    selectLanguage: "Select Language",
    logout: "Logout",
    schemeDiscovery: "Scheme Discovery",
    schemeDescription: "Find the right government schemes for you",
    typeYourSituation: "Type your current situation...",
    send: "Send",
    familyAccount: "Family Account",
    familyDescription: "Manage applications for your entire family",
    addFamilyMember: "Add Family Member",
    editFamilyMember: "Edit Family Member",
    lifeEventNotifications: "Life-Event Notifications",
    lifeEventDescription: "Stay informed about important milestones",
    atalPensionScheme: "Atal Pension Scheme",
    atalPensionDescription: "You're turning 18 soon,Secure your future with a guaranteed pension!",
    applyNow: "Apply Now",
    drivingLicenseRenewal: "Driving License Renewal",
    drivingLicenseDescription: "Your license expires in 30 days",
    renew: "Renew",
    documentVault: "Document Vault",
    documentDescription: "Securely store and manage your important documents",
    footer: "© 2025 En-Thiran Citizen Services. All rights reserved.",
    name: "Name",
    relation: "Relation",
    aadharNumber: "Aadhar Number",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    familyMembersList: "Family Members List",
    noFamilyMembers: "No family members added yet. Add your first family member above.",
    uploadDocument: "Upload Document",
    selectFile: "Select File",
    close: "Close",
    blankPageTitle: "Document Details",
    backToDashboard: "Back to Dashboard",
  },
  hindi: {
    title: "एन-थिरन नागरिक सेवाएं",
    selectLanguage: "भाषा चुनें",
    logout: "लॉग आउट",
    schemeDiscovery: "योजना खोज",
    schemeDescription: "आपके लिए सही सरकारी योजनाएं खोजें",
    typeYourSituation: "अपनी वर्तमान स्थिति टाइप करें...",
    send: "भेजें",
    familyAccount: "परिवार खाता",
    familyDescription: "अपने पूरे परिवार के लिए आवेदन प्रबंधित करें",
    addFamilyMember: "परिवार का सदस्य जोड़ें",
    editFamilyMember: "परिवार के सदस्य को संपादित करें",
    lifeEventNotifications: "जीवन-घटना सूचनाएं",
    lifeEventDescription: "महत्वपूर्ण मील के पत्थरों के बारे में जानकारी प्राप्त करें",
    atalPensionScheme: "अटल पेंशन योजना",
    atalPensionDescription: "गारंटीकृत पेंशन के साथ अपने भविष्य को सुरक्षित करें!",
    applyNow: "अभी आवेदन करें",
    drivingLicenseRenewal: "ड्राइविंग लाइसेंस नवीनीकरण",
    drivingLicenseDescription: "आपका लाइसेंस 30 दिनों में समाप्त हो रहा है",
    renew: "नवीनीकरण करें",
    documentVault: "दस्तावेज़ वॉल्ट",
    documentDescription: "अपने महत्वपूर्ण दस्तावेजों को सुरक्षित रूप से संग्रहीत और प्रबंधित करें",
    footer: "© 2025 एन-थिरन नागरिक सेवाएं। सर्वाधिकार सुरक्षित।",
    name: "नाम",
    relation: "रिश्ता",
    aadharNumber: "आधार संख्या",
    save: "सहेजें",
    cancel: "रद्द करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    familyMembersList: "परिवार के सदस्यों की सूची",
    noFamilyMembers: "अभी तक कोई परिवार का सदस्य नहीं जोड़ा गया है। ऊपर अपना पहला परिवार का सदस्य जोड़ें।",
    uploadDocument: "दस्तावेज़ अपलोड करें",
    selectFile: "फ़ाइल का चयन करें",
    applyNow: "अभी आवेदन करें",
    close: "बंद करें",
    blankPageTitle: "दस्तावेज़ विवरण",
    backToDashboard: "डैशबोर्ड पर वापस जाएँ",
  },
  tamil: {
    title: "என்-திரன் குடிமக்கள் சேவைகள்",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    logout: "வெளியேறு",
    schemeDiscovery: "திட்டம் கண்டுபிடிப்பு",
    schemeDescription: "உங்களுக்கான சரியான அரசு திட்டங்களைக் கண்டறியவும்",
    typeYourSituation: "உங்கள் தற்போதைய நிலையை தட்டச்சு செய்யவும்...",
    send: "அனுப்பு",
    familyAccount: "குடும்ப கணக்கு",
    familyDescription: "உங்கள் முழு குடும்பத்திற்கும் விண்ணப்பங்களை நிர்வகிக்கவும்",
    addFamilyMember: "குடும்ப உறுப்பினரைச் சேர்க்கவும்",
    editFamilyMember: "குடும்ப உறுப்பினரைத் திருத்தவும்",
    lifeEventNotifications: "வாழ்க்கை நிகழ்வு அறிவிப்புகள்",
    lifeEventDescription: "முக்கியமான மைல்கற்கள் பற்றி தெரிந்து கொள்ளுங்கள்",
    atalPensionScheme: "அடல் ஓய்வூதியத் திட்டம்",
    atalPensionDescription: "உத்தரவாதமான ஓய்வூதியத்துடன் உங்கள் எதிர்காலத்தை பாதுகாக்கவும்!",
    applyNow: "இப்போது விண்ணப்பிக்கவும்",
    drivingLicenseRenewal: "ஓட்டுநர் உரிமம் புதுப்பித்தல்",
    drivingLicenseDescription: "உங்கள் உரிமம் 30 நாட்களில் காலாவதியாகிறது",
    renew: "புதுப்பிக்கவும்",
    documentVault: "ஆவண காப்பகம்",
    documentDescription: "உங்கள் முக்கியமான ஆவணங்களை பாதுகாப்பாக சேமித்து நிர்வகிக்கவும்",
    footer: "© 2025 என்-திரன் குடிமக்கள் சேவைகள். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    name: "பெயர்",
    relation: "உறவு",
    aadharNumber: "ஆதார் எண்",
    save: "சேமி",
    cancel: "ரத்து செய்",
    edit: "திருத்து",
    delete: "நீக்கு",
    familyMembersList: "குடும்ப உறுப்பினர்கள் பட்டியல்",
    noFamilyMembers: "இதுவரை குடும்ப உறுப்பினர்கள் யாரும் சேர்க்கப்படவில்லை. மேலே உங்கள் முதல் குடும்ப உறுப்பினரைச் சேர்க்கவும்.",
    uploadDocument: "ஆவணத்தை பதிவேற்றவும்",
    selectFile: "கோப்பைத் தேர்ந்தெடுக்கவும்",
    applyNow: "இப்போது விண்ணப்பிக்கவும்",
    close: "மூடு",
    blankPageTitle: "ஆவண விவரங்கள்",
    backToDashboard: "கட்டுப்பாட்டுப் பலகைக்குத் திரும்பு",
  }
}

export default function EnThiranDashboard() {
  const [language, setLanguage] = useState("english")
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const { toast } = useToast()

  const t = translations[language as keyof typeof translations]

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
    const savedFamilyMembers = localStorage.getItem('familyMembers')
    if (savedFamilyMembers) {
      try {
        const parsedMembers = JSON.parse(savedFamilyMembers)
        console.log("Loaded family members from localStorage:", parsedMembers)
        setFamilyMembers(parsedMembers)
      } catch (error) {
        console.error("Error parsing family members from localStorage:", error)
        localStorage.removeItem('familyMembers')
      }
    }
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('language')
    localStorage.removeItem('familyMembers')
    localStorage.removeItem('selectedDocument') // Added to clear selectedDocument on logout
    // Redirect to login page or perform other logout actions
  }, [])

  const handleSaveFamilyMember = useCallback((member: FamilyMember) => {
    console.log("Saving family member:", member);
    setFamilyMembers(prevMembers => {
      const updatedMembers = member.id
        ? prevMembers.map(m => m.id === member.id ? member : m)
        : [...prevMembers, member];
      console.log("Updated family members:", updatedMembers);
      localStorage.setItem('familyMembers', JSON.stringify(updatedMembers));
      return updatedMembers;
    });
    toast({
      title: member.id ? "Family member updated" : "Family member added",
      description: `${member.name} has been ${member.id ? 'updated' : 'added'} to your family account.`,
    });
  }, [toast]);

  const handleDeleteFamilyMember = useCallback((id: string) => {
    console.log("Deleting family member with id:", id)
    setFamilyMembers(prevMembers => {
      const updatedMembers = prevMembers.filter(m => m.id !== id)
      console.log("Updated family members after deletion:", updatedMembers)
      return updatedMembers
    })
    toast({
      title: "Family member removed",
      description: "The family member has been removed from your account.",
    })
  }, [toast])

  const handleDocumentUpload = useCallback((file: File) => {
    console.log("Uploading document:", file.name)
    // Here you would typically handle the file upload to a server
    toast({
      title: "Document uploaded",
      description: `${file.name} has been uploaded to your document vault.`,
    })
  }, [toast])

  const handleApplyNow = useCallback(() => {
    console.log("Applying for Atal Pension Scheme")
    // Here you would typically handle the application process
    toast({
      title: "Application submitted",
      description: "Your Atal Pension Scheme application has been submitted successfully.",
    })
  }, [toast])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">{t.title}</h1>
        <div className="flex items-center space-x-4">
          <Select value={language} onValueChange={(value) => {
            setLanguage(value)
            localStorage.setItem('language', value)
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t.selectLanguage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">हिंदी</SelectItem>
              <SelectItem value="tamil">தமிழ்</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleLogout}>{t.logout}</Button>
        </div>
      </header>

      <main className="space-y-6">
        <SchemeDiscoveryChat translations={t} />

        <Card>
          <CardHeader>
            <CardTitle>{t.familyAccount}</CardTitle>
            <CardDescription>{t.familyDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t.familyMembersList}</h3>
                <FamilyMemberForm onSave={handleSaveFamilyMember} translations={t}>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    {t.addFamilyMember}
                  </Button>
                </FamilyMemberForm>
              </div>
              {familyMembers.length === 0 ? (
                <p className="text-muted-foreground">{t.noFamilyMembers}</p>
              ) : (
                <div className="space-y-4">
                  {familyMembers.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{t.relation}: {member.relation}</p>
                          <p className="text-sm text-muted-foreground">{t.aadharNumber}: {member.aadhar}</p>
                        </div>
                        <div className="flex space-x-2">
                          <FamilyMemberForm member={member} onSave={handleSaveFamilyMember} translations={t}>
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </FamilyMemberForm>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteFamilyMember(member.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.lifeEventNotifications}</CardTitle>
            <CardDescription>{t.lifeEventDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <GuidelinesPage
                title={t.atalPensionScheme}
                description={t.atalPensionDescription}
                guidelines={[
                  "Eligibility: Open to Indian citizens aged 18-40 years with a savings or post office account.",
                  "Pension Benefits: Provides a fixed monthly pension of ₹1,000 to ₹5,000 starting from age 60.",
                  "Contribution: Monthly, quarterly, or annual contributions depend on entry age and desired pension amount.",
                  "Government Co-Contribution: Eligible accounts receive government contributions for the first 5 years.",
                  "Nominee Provision: Spouse continues to receive a pension after the subscriber's death, and nominee receives the corpus thereafter.",
                ]}
                onApply={handleApplyNow}
                translations={t}
              >
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <h3 className="font-semibold">{t.atalPensionScheme}</h3>
                    <p className="text-sm text-muted-foreground">{t.atalPensionDescription}</p>
                  </div>
                  <Button size="sm">{t.applyNow}</Button>
                </div>
              </GuidelinesPage>
              <GuidelinesPage
                title={t.drivingLicenseRenewal}
                description={t.drivingLicenseDescription}
                guidelines={[
                  "You must have a valid learner's license",
                  "You must be at least 18 years old",
                  "You must pass the driving test",
                  "You must provide proof of address and identity",
                ]}
                onApply={() => {
                  console.log("Applying for Driving License Renewal")
                  toast({
                    title: "Application submitted",
                    description: "Your Driving License Renewal application has been submitted successfully.",
                  })
                }}
                translations={t}
              >
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <h3 className="font-semibold">{t.drivingLicenseRenewal}</h3>
                    <p className="text-sm text-muted-foreground">{t.drivingLicenseDescription}</p>
                  </div>
                  <Button size="sm">{t.renew}</Button>
                </div>
              </GuidelinesPage>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.documentVault}</CardTitle>
            <CardDescription>{t.documentDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <DocumentUpload
                onUpload={handleDocumentUpload}
                translations={{
                  uploadDocument: t.uploadDocument,
                  selectFile: t.selectFile,
                  upload: t.save,
                  cancel: t.cancel,
                }}
              />
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setSelectedDocument("Aadhaar Card")}
              >
                Aadhaar Card
                <span className="text-sm text-muted-foreground">Last updated: 2 months ago</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setSelectedDocument("PAN Card")}
              >
                PAN Card
                <span className="text-sm text-muted-foreground">Last updated: 1 year ago</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setSelectedDocument("Birth Certificate")}
              >
                Birth Certificate
                <span className="text-sm text-muted-foreground">Last updated: 5 years ago</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <DocumentDetailsPopup
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          title={selectedDocument || ""}
          translations={t}
        />
      </main>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        {t.footer}
      </footer>
    </div>
  )
}


