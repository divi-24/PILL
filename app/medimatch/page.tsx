"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Star, MessageSquare, Calendar, MapPin, Clock, Search, Users } from "lucide-react"
import { motion } from "framer-motion"

export default function MediMatchPage() {
  const [doctors] = useState([
    {
      id: 1,
      name: "Dr. Sarah Chen",
      specialty: "Cardiologist",
      experience: "15 years",
      rating: 4.9,
      reviews: 128,
      location: "City Medical Center",
      availability: "Next available: Tomorrow",
      languages: ["English", "Mandarin"],
      education: "MD, Harvard Medical School",
      image: "/doctors/doctor1.jpg"
    },
    {
      id: 2,
      name: "Dr. Michael Rodriguez",
      specialty: "Pediatrician",
      experience: "12 years",
      rating: 4.8,
      reviews: 95,
      location: "Children's Hospital",
      availability: "Next available: Today",
      languages: ["English", "Spanish"],
      education: "MD, Johns Hopkins University",
      image: "/doctors/doctor2.jpg"
    },
    {
      id: 3,
      name: "Dr. Emily Thompson",
      specialty: "Dermatologist",
      experience: "8 years",
      rating: 4.7,
      reviews: 76,
      location: "Skin Care Clinic",
      availability: "Next available: Next Week",
      languages: ["English"],
      education: "MD, Stanford University",
      image: "/doctors/doctor3.jpg"
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
              MediMatch
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              Find the perfect healthcare provider for you
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
              <Search className="w-4 h-4" />
              Search Providers
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 gap-2">
              <Heart className="w-4 h-4" />
              Saved Providers
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
                  <Star className="w-5 h-5 text-primary" />
                  Recommended Providers
                </CardTitle>
                <CardDescription>Based on your health profile and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {doctors.map((doctor) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: doctor.id * 0.1 }}
                    className="p-4 rounded-xl border hover:border-primary/20 transition-colors bg-card/50 backdrop-blur-sm"
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xl">👨‍⚕️</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base font-medium group-hover:text-primary transition-colors">{doctor.name}</h3>
                            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span className="text-sm">{doctor.rating}</span>
                            <span className="text-sm text-muted-foreground">({doctor.reviews})</span>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-sm">{doctor.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-sm">{doctor.availability}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <h4 className="text-sm font-medium mb-1">Languages</h4>
                          <div className="flex gap-1.5">
                            {doctor.languages.map((lang) => (
                              <span
                                key={lang}
                                className="px-2 py-0.5 bg-primary/10 rounded-full text-xs text-primary"
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-8">
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Appointment
                          </Button>
                          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 h-8">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 border-primary text-primary hover:bg-primary/10">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden hover:shadow-xl transition-all border hover:border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary/80 opacity-0 transition-opacity group-hover:opacity-5" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-secondary" />
                  Your Preferences
                </CardTitle>
                <CardDescription>Customize your provider search</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {["Cardiology", "Pediatrics", "Dermatology", "Orthopedics"].map((specialty) => (
                      <span key={specialty} className="px-2 py-0.5 bg-secondary/10 rounded-full text-xs text-secondary">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {["English", "Spanish", "Mandarin"].map((lang) => (
                      <span key={lang} className="px-2 py-0.5 bg-secondary/10 rounded-full text-xs text-secondary">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Availability</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {["Weekdays", "Weekends", "Evenings"].map((time) => (
                      <span key={time} className="px-2 py-0.5 bg-secondary/10 rounded-full text-xs text-secondary">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-8 mt-2">
                  Update Preferences
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 