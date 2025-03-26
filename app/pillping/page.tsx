"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Clock, Calendar, CheckCircle2, AlertCircle, Plus, ChevronRight, Pill, History, BellRing } from "lucide-react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

export default function PillPingPage() {
  const [medications] = useState([
    {
      id: 1,
      name: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once daily",
      time: "Morning",
      nextDose: "Tomorrow, 8:00 AM",
      status: "upcoming",
      progress: 75
    },
    {
      id: 2,
      name: "Blood Pressure Medication",
      dosage: "50mg",
      frequency: "Twice daily",
      time: "Morning and Evening",
      nextDose: "Today, 8:00 PM",
      status: "upcoming",
      progress: 50
    },
    {
      id: 3,
      name: "Diabetes Medication",
      dosage: "500mg",
      frequency: "With meals",
      time: "Before breakfast",
      nextDose: "Taken",
      status: "taken",
      progress: 100
    }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PillPing
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              Smart medication reminders and tracking system that helps you never miss a dose
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center gap-3"
          >
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              Add Medication
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 gap-2">
              <Bell className="w-4 h-4" />
              Set Reminder
            </Button>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 h-[calc(100vh-16rem)]"
          >
            <Card className="lg:col-span-2 group relative overflow-hidden hover:shadow-xl transition-all border hover:border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 opacity-0 transition-opacity group-hover:opacity-5" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>Your medication schedule for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {medications.map((med) => (
                  <motion.div
                    key={med.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: med.id * 0.1 }}
                    className="p-4 rounded-xl border hover:border-primary/20 transition-colors bg-card/50 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {med.status === "taken" ? (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-secondary" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base font-medium group-hover:text-primary transition-colors">{med.name}</h3>
                            <p className="text-sm text-muted-foreground">{med.dosage}</p>
                            <p className="text-sm text-muted-foreground">{med.frequency}</p>
                            <p className="text-sm font-medium mt-1 text-primary">{med.nextDose}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{med.progress}%</span>
                          </div>
                          <Progress value={med.progress} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="group relative overflow-hidden hover:shadow-xl transition-all border hover:border-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary/80 opacity-0 transition-opacity group-hover:opacity-5" />
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5 text-secondary" />
                    Weekly Overview
                  </CardTitle>
                  <CardDescription>Your medication adherence this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                    <div key={day} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/5 transition-colors">
                      <span className="font-medium text-sm">{day}</span>
                      <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden hover:shadow-xl transition-all border hover:border-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 opacity-0 transition-opacity group-hover:opacity-5" />
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="w-5 h-5 text-primary" />
                    Reminder Settings
                  </CardTitle>
                  <CardDescription>Configure your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { name: "Push Notifications", icon: BellRing },
                    { name: "Email Reminders", icon: Bell },
                    { name: "SMS Alerts", icon: Bell },
                    { name: "Reminder Time", icon: Clock }
                  ].map((setting) => (
                    <div key={setting.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <setting.icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-sm">{setting.name}</span>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 border-primary text-primary hover:bg-primary/10">
                        Configure
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 