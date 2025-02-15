"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [language, setLanguage] = useState("english")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically validate the credentials against a backend
    // For this example, we'll just check if both fields are filled
    if (username && password) {
      // Store the language preference (you might want to use a more persistent solution in a real app)
      localStorage.setItem('language', language)
      // Navigate to the dashboard
      router.push('/dashboard')
    } else {
      alert("Please enter both username and password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">En-Thiran Citizen Services</CardTitle>
          <CardDescription className="text-center">Login to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username or Aadhaar Number</Label>
              <Input 
                id="username" 
                placeholder="Enter your username or Aadhaar number"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="tamil">Tamil</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="telugu">Telugu</SelectItem>
                  <SelectItem value="kannada">Kannada</SelectItem>
                  <SelectItem value="malayalam">Malayalam</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">Login</Button>
            <div className="text-sm text-center space-y-2">
              <a href="#" className="text-primary hover:underline">Forgot password?</a>
              <p>
                Don't have an account?{" "}
                <a href="#" className="text-primary hover:underline">Register here</a>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

