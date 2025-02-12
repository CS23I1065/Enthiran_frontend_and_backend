"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Message {
  role: 'user' | 'bot';
  content: string;
}

interface SchemeDiscoveryChatProps {
  translations: {
    schemeDiscovery: string;
    schemeDescription: string;
    typeYourSituation: string;
    send: string;
  };
}

export function SchemeDiscoveryChat({ translations }: SchemeDiscoveryChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")

  const handleSend = async () => {
    if (input.trim()) {
        setMessages([...messages, { role: 'user', content: input }]);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/process_query/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: input }),
            });

            const data = await response.json();
            console.log("API Response:", data);

            // Fix: Check `data.response` instead of `data.schemes`
            if (data.response && data.response.trim() !== "" && !data.response.includes("[Scholarship Name]")) {
                setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', content: "No schemes found for your query." }]);
            }

        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { role: 'bot', content: "Error fetching schemes. Please try again later." }]);
        }

        setInput("");
    }
};


  
  

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{translations.schemeDiscovery}</CardTitle>
        <CardDescription>{translations.schemeDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[300px] overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg p-2 max-w-[80%] whitespace-pre-line ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
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
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend}>{translations.send}</Button>
        </div>
      </CardContent>
    </Card>
  )
}

