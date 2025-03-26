"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Search, Clock, Phone, Star, Calendar } from "lucide-react"

export default function MediMapPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [healthcareProviders] = useState([
    {
      id: 1,
      name: "City Medical Center",
      type: "Hospital",
      address: "123 Healthcare Ave, City",
      rating: 4.8,
      reviews: 156,
      distance: "2.5 km",
      openHours: "24/7",
      phone: "+1 (555) 123-4567",
      specialties: ["Emergency Care", "General Medicine", "Pediatrics"],
      availability: "Open Now"
    },
    {
      id: 2,
      name: "Wellness Pharmacy",
      type: "Pharmacy",
      address: "456 Health Street, City",
      rating: 4.6,
      reviews: 89,
      distance: "1.8 km",
      openHours: "8:00 AM - 10:00 PM",
      phone: "+1 (555) 234-5678",
      specialties: ["Prescriptions", "Health Supplies", "Consultation"],
      availability: "Open Now"
    },
    {
      id: 3,
      name: "Family Care Clinic",
      type: "Clinic",
      address: "789 Care Lane, City",
      rating: 4.7,
      reviews: 112,
      distance: "3.2 km",
      openHours: "9:00 AM - 6:00 PM",
      phone: "+1 (555) 345-6789",
      specialties: ["Family Medicine", "Preventive Care", "Vaccinations"],
      availability: "Closed"
    }
  ])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">MediMap</h1>
          <p className="text-muted-foreground">Find healthcare providers near you</p>
        </div>
        <Button className="gap-2">
          <MapPin className="w-4 h-4" />
          Set Location
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5" />
              <input
                type="text"
                placeholder="Search for healthcare providers..."
                className="flex-1 p-2 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <CardTitle>Nearby Providers</CardTitle>
            <CardDescription>Healthcare facilities in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthcareProviders.map((provider) => (
                <div key={provider.id} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">{provider.type}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{provider.rating}</span>
                      <span className="text-sm text-muted-foreground">({provider.reviews})</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{provider.address}</span>
                    <span>•</span>
                    <span>{provider.distance}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {provider.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 rounded-full text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{provider.openHours}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{provider.phone}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book
                      </Button>
                      <Button variant="outline" size="sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Map View
            </CardTitle>
            <CardDescription>Visualize healthcare providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] bg-muted rounded-lg flex items-center justify-center">
              Map Component Placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 