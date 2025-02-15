"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRef, useEffect } from "react"

interface Message {
  role: "user" | "bot"
  content: string
}

interface SchemeDiscoveryChatProps {
  translations: {
    schemeDiscovery: string
    schemeDescription: string
    typeYourSituation: string
    send: string
  }
}

interface Scheme {
  name: string
  description: string
  link: string
}


export function SchemeDiscoveryChat({ translations }: SchemeDiscoveryChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (input.trim()) {
      setIsLoading(true)
      setMessages((prev) => [...prev, { role: "user", content: input }])
  
      try {
        const response = await fetch("http://127.0.0.1:8000/api/schemes/search/", {  // <-- Update the API URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: input }),  // <-- Use "query" instead of "situation"
        })
  
        if (!response.ok) {
          throw new Error("Failed to fetch schemes")
        }
  
        const data = await response.json()
  
        if (data.results.length > 0) {
          const schemesText = data.results
            .map((scheme : Scheme) => `🔹 ${scheme.name}\n📌 ${scheme.description}\n🔗 ${scheme.link}`)
            .join("\n\n")
  
          setMessages((prev) => [...prev, { role: "bot", content: schemesText }])
        } else {
          setMessages((prev) => [...prev, { role: "bot", content: "No relevant schemes found for your situation." }])
        }
  
      } catch (error) {
        console.error("Error:", error)
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: "I apologize, but I encountered an error while fetching the schemes. Please try again later.",
          },
        ])
      } finally {
        setIsLoading(false)
        setInput("")
      }
    }
  }
  

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{translations.schemeDiscovery}</CardTitle>
        <CardDescription>{translations.schemeDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[500px] overflow-y-auto border p-2 rounded-lg">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-lg p-2 max-w-[80%] whitespace-pre-line ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
              >
                <div dangerouslySetInnerHTML={{ __html: message.content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" class="text-blue-500 underline" target="_blank">$1</a>') }} />
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
        </div>
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={translations.typeYourSituation}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {translations.send}
          </Button>
        </div>
      </CardContent>
    </Card>
    
  )
}

