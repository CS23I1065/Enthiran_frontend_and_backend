"use client"

import { useState, useEffect, useCallback } from "react"
import { Pencil, Trash2, Plus, FileIcon, Download, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import  FamilyMembers  from "../components/FamilyMemberForm"
import { SchemeDiscoveryChat } from "../components/SchemeDiscoveryChat"
import { DocumentUpload } from "../components/DocumentUpload"
import { GuidelinesPage } from "../components/GuidelinesPage"
import { useToast } from "@/components/ui/use-toast"
import { DocumentDetailsPopup } from "../components/DocumentDetailsPopup"
import { getAllFiles, deleteFile, getFile } from "../utils/fileStorage"

interface FamilyMember {
  id: string
  name: string
  relation: string
  aadhar: string
}

interface Document {
  id: string
  name: string
  lastUpdated: string
  type: string
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
    atalPensionDescription: "Secure your future with a guaranteed pension!",
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
    noFamilyMembers: "Vasudhaiva Kutumbakam",
    uploadDocument: "Upload Document",
    selectFile: "Select File",
    close: "Close",
    blankPageTitle: "Document Details",
    backToDashboard: "Back to Dashboard",
    noDocuments: "No documents uploaded yet.",
    viewDetails: "View Details",
    download: "Download",
    loading: "Loading...",
    errorLoading: "Error loading content.",
    viewGuidelines: "View Guidelines", 
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
    noFamilyMembers: "वसुधैव परिवार",
    uploadDocument: "दस्तावेज़ अपलोड करें",
    selectFile: "फ़ाइल का चयन करें",
    close: "बंद करें",
    blankPageTitle: "दस्तावेज़ विवरण",
    backToDashboard: "डैशबोर्ड पर वापस जाएँ",
    noDocuments: "अभी तक कोई दस्तावेज़ अपलोड नहीं किया गया है।",
    viewDetails: "विस्तृत जानकारी देखें",
    download: "डाउनलोड करें",
    loading: "लोड हो रहा है...", 
    errorLoading: "सामग्री लोड करने में त्रुटि।",
    viewGuidelines: "दिशानिर्देश देखें" 
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
    noFamilyMembers: "வசுதைவ குடும்பம்",
    uploadDocument: "ஆவணத்தை பதிவேற்றவும்",
    selectFile: "கோப்பைத் தேர்ந்தெடுக்கவும்",
    close: "மூடு",
    blankPageTitle: "ஆவண விவரங்கள்",
    backToDashboard: "கட்டுப்பாட்டுப் பலகைக்குத் திரும்பு",
    noDocuments: "இதுவரை எந்த ஆவணமும் பதிவேற்றப்படவில்லை.",
    viewDetails: "விவரங்களைப் பார்க்கவும்",
    download: "பதிவிறக்கம்",
    loading: "ஏற்றுகிறது...",
    errorLoading: "உள்ளடக்கத்தை ஏற்றுவதில் பிழை.",
    viewGuidelines: "மார்க்கத்தைக் காண்க"
  },
}

export default function EnThiranDashboard() {
  const [language, setLanguage] = useState("english")
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const { toast } = useToast()

  const t = translations[language as keyof typeof translations]

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
    loadFamilyMembers()
    loadDocuments()
  }, [])

  const loadFamilyMembers = () => {
    const savedFamilyMembers = localStorage.getItem("familyMembers")
    if (savedFamilyMembers) {
      try {
        const parsedMembers = JSON.parse(savedFamilyMembers)
        setFamilyMembers(parsedMembers)
      } catch (error) {
        console.error("Error parsing family members from localStorage:", error)
        localStorage.removeItem("familyMembers")
      }
    }
  }

  const loadDocuments = async () => {
    try {
      const files = await getAllFiles()
      setDocuments(files)
    } catch (error) {
      console.error("Error loading documents:", error)
      toast({
        title: "Error",
        description: "Failed to load documents. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = useCallback(() => {
    localStorage.removeItem("language")
    localStorage.removeItem("familyMembers")
    localStorage.removeItem("documents")
    // Redirect to login page or perform other logout actions
  }, [])

  const handleSaveFamilyMember = useCallback(
    (member: FamilyMember) => {
      setFamilyMembers((prevMembers) => {
        const updatedMembers = member.id
          ? prevMembers.map((m) => (m.id === member.id ? member : m))
          : [...prevMembers, { ...member, id: Date.now().toString() }]
        localStorage.setItem("familyMembers", JSON.stringify(updatedMembers))
        return updatedMembers
      })
      toast({
        title: member.id ? "Family member updated" : "Family member added",
        description: `${member.name} has been ${member.id ? "updated" : "added"} to your family account.`,
      })
    },
    [toast],
  )

  const handleDeleteFamilyMember = useCallback(
    (id: string) => {
      setFamilyMembers((prevMembers) => {
        const updatedMembers = prevMembers.filter((m) => m.id !== id)
        localStorage.setItem("familyMembers", JSON.stringify(updatedMembers))
        return updatedMembers
      })
      toast({
        title: "Family member removed",
        description: "The family member has been removed from your account.",
      })
    },
    [toast],
  )

  const handleDocumentUpload = useCallback(
    (fileId: string, fileName: string, fileType: string) => {
      const newDocument: Document = {
        id: fileId,
        name: fileName,
        type: fileType,
        lastUpdated: new Date().toLocaleDateString(),
      }
      setDocuments((prevDocuments) => [...prevDocuments, newDocument])
      toast({
        title: "Document uploaded",
        description: `${fileName} has been uploaded to your document vault.`,
      })
    },
    [toast],
  )

  const handleDeleteDocument = useCallback(
    async (id: string) => {
      try {
        await deleteFile(id)
        setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc.id !== id))
        toast({
          title: "Document deleted",
          description: "The document has been removed from your vault.",
        })
      } catch (error) {
        console.error("Error deleting document:", error)
        toast({
          title: "Error",
          description: "Failed to delete the document. Please try again.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleDownloadDocument = useCallback(
    async (id: string, name: string) => {
      try {
        const file = await getFile(id)
        if (file) {
          const url = URL.createObjectURL(file)
          const a = document.createElement("a")
          a.href = url
          a.download = name
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      } catch (error) {
        console.error("Error downloading document:", error)
        toast({
          title: "Error",
          description: "Failed to download the document. Please try again.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleApplyNow = useCallback((scheme: string) => {
    let url = ""
    if (scheme === "atal") {
      url = "https://www.india.gov.in/registration-form-atal-pension-yojana-apy"
    } else if (scheme === "driving") {
      url = "https://services.india.gov.in/service/detail/online-renewal-of-driving-license"
    }
    if (url) {
      window.open(url, "_blank")
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">{t.title}</h1>
        <div className="flex items-center space-x-4">
          <Select
            value={language}
            onValueChange={(value) => {
              setLanguage(value)
              localStorage.setItem("language", value)
            }}
          >
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
              <FamilyMembers onSave={handleSaveFamilyMember} translations={t}>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  {t.addFamilyMember}
                </Button>
              </FamilyMembers>
              {familyMembers.length === 0 ? (
                <p className="text-muted-foreground">{t.noFamilyMembers}</p>
              ) : (
                <div className="space-y-4">
                  {familyMembers.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t.relation}: {member.relation}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t.aadharNumber}: {member.aadhar}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <FamilyMembers member={member} onSave={handleSaveFamilyMember} translations={t}>
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </FamilyMembers>
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
                schemeName="Atal Pension Scheme"
                applyUrl="https://www.india.gov.in/registration-form-atal-pension-yojana-apy"
                guidelines={[
                  "Eligibility: Open to Indian citizens aged 18-40 years with a savings or post office account.",
                  "Pension Benefits: Provides a fixed monthly pension of ₹1,000 to ₹5,000 starting from age 60.",
                  "Contribution: Monthly, quarterly, or annual contributions depend on entry age and desired pension amount.",
                  "Government Co-Contribution: Eligible accounts receive government contributions for the first 5 years.",
                  "Nominee Provision: Spouse continues to receive a pension after the subscriber's death, and nominee receives the corpus thereafter.",
                ]}
                onApply={() => handleApplyNow("atal")}
                translations={t}
              >
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <h3 className="font-semibold">{t.atalPensionScheme}</h3>
                    <p className="text-sm text-muted-foreground">{t.atalPensionDescription}</p>
                  </div>
                  <Button size="sm" onClick={() => handleApplyNow("atal")}>
                    {t.applyNow}
                  </Button>
                  <Button size="sm" onClick={() => handleApplyNow("atal")}>
                    {t.applyNow}
                  </Button>
                </div>
              </GuidelinesPage>
              <GuidelinesPage
                title={t.drivingLicenseRenewal}
                description={t.drivingLicenseDescription}
                schemeName="Driving License Renewal"
                applyUrl="https://services.india.gov.in/service/detail/online-renewal-of-driving-license"
                guidelines={[
                  "You must have a valid learner's license",
                  "You must be at least 18 years old",
                  "You must pass the driving test",
                  "You must provide proof of address and identity",
                ]}
                onApply={() => handleApplyNow("driving")}
                translations={t}
              >
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <h3 className="font-semibold">{t.drivingLicenseRenewal}</h3>
                    <p className="text-sm text-muted-foreground">{t.drivingLicenseDescription}</p>
                  </div>
                  <Button size="sm" onClick={() => handleApplyNow("driving")}>
                    {t.renew}
                  </Button>
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
            <div className="space-y-4">
              <DocumentUpload
                onUpload={handleDocumentUpload}
                translations={{
                  uploadDocument: t.uploadDocument,
                  selectFile: t.selectFile,
                  upload: t.save,
                  cancel: t.cancel,
                }}
              />
              {documents.length === 0 ? (
                <p className="text-muted-foreground text-center">{t.noDocuments}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                          <FileIcon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-center mb-1">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground text-center">Last updated: {doc.lastUpdated}</p>
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(doc.id, doc.name)}>
                            <Download className="w-4 h-4 mr-2" />
                            {t.download}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handlePerformOCR(doc.id, doc.name)}>
                            <Scan className="w-4 h-4 mr-2" />
                            {t.performOCR}
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t.delete}
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

        <DocumentDetailsPopup
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          documentId={selectedDocument}
          translations={t} title={""}        />
      </main>

      <footer className="mt-8 text-center text-sm text-muted-foreground">{t.footer}</footer>
    </div>
  )
}

