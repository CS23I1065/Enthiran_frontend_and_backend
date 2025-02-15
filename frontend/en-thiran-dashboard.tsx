"use client"

import { useState } from "react"
import { Bell, Search, Users } from 'lucide-react'
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

export default function EnThiranDashboard() {
  const [language, setLanguage] = useState("english")

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">En-Thiran Citizen Services</h1>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[180px]">
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
      </header>

      <main className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Scheme Discovery</CardTitle>
            <CardDescription>Find the right government schemes for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input placeholder="Search for schemes..." className="flex-grow" />
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Family Account</CardTitle>
              <CardDescription>Manage applications for your entire family</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                View Family Members
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Life-Event Notifications</CardTitle>
              <CardDescription>Stay informed about important milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <h3 className="font-semibold">Atal Pension Scheme</h3>
                    <p className="text-sm text-muted-foreground">You're turning 18 soon!</p>
                  </div>
                  <Button size="sm">Apply Now</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <h3 className="font-semibold">Driving License Renewal</h3>
                    <p className="text-sm text-muted-foreground">Your license expires in 30 days</p>
                  </div>
                  <Button size="sm">Renew</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Document Vault</CardTitle>
            <CardDescription>Securely store and manage your important documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-between">
                Aadhaar Card
                <span className="text-sm text-muted-foreground">Last updated: 2 months ago</span>
              </Button>
              <Button variant="outline" className="w-full justify-between">
                PAN Card
                <span className="text-sm text-muted-foreground">Last updated: 1 year ago</span>
              </Button>
              <Button variant="outline" className="w-full justify-between">
                Birth Certificate
                <span className="text-sm text-muted-foreground">Last updated: 5 years ago</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        © 2024 En-Thiran Citizen Services. All rights reserved.
      </footer>
    </div>
  )
}

