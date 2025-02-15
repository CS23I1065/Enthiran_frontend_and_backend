"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

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

export function SchemeDiscoveryChat({ translations }: SchemeDiscoveryChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (input.trim()) {
      setIsLoading(true)
      setMessages((prev) => [...prev, { role: "user", content: input }])

      try {
        const response = await fetch("/api/scheme-discovery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ situation: input }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch schemes")
        }

        const data = await response.json()

        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: data.response,
          },
        ])
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
        <div className="space-y-4 h-[300px] overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-lg p-2 max-w-[80%] whitespace-pre-line ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
              >
                {message.content}
              </div>
            </div>
          ))}
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

