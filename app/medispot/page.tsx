"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Settings2, Loader2, AlertCircle, CheckCircle2, MapPin, Search, Phone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useFileUpload } from "@/hooks/use-file-upload"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Script from "next/script"
import NearbyPharmacies from "@/components/NearbyPharmacies"

interface PrescriptionSettings {
  scale: number
  margin: number
  useDictionary: boolean
  minWordsPerLine: number
  textScale: number
}

interface Pharmacy {
  name: string
  address: string
  rating: number
  location: {
    lat: number
    lng: number
  }
  distance: number
  types: string[]
  isOpen: boolean
  phone: string
  website: string
}

export default function MediSpot() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [medicines, setMedicines] = useState<string[]>([])
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [showOnlyOpen, setShowOnlyOpen] = useState(false)
  const [maxDistance, setMaxDistance] = useState(10) // in km

  const [settings, setSettings] = useState<PrescriptionSettings>({
    scale: 1.0,
    margin: 10,
    useDictionary: true,
    minWordsPerLine: 3,
    textScale: 1.0,
  })

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          initializeMap(location)
        },
        (error) => {
          console.error("Error getting location:", error)
        }
      )
    }
  }, [])

  const initializeMap = (center: { lat: number; lng: number }) => {
    const mapElement = document.getElementById("map")
    if (!mapElement) return

    const mapInstance = new google.maps.Map(mapElement, {
      center,
      zoom: 13,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    })
    setMap(mapInstance)
  }

  const handleImageUpload = async (file: File) => {
    setIsLoading(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("settings", JSON.stringify(settings))

      const response = await fetch("https://mediguide-8p26.onrender.com/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to process prescription")
      
      const data = await response.json()
      setResult(data.text)
      
      // Extract medicine names from the text
      const extractedMedicines = extractMedicineNames(data.text)
      setMedicines(extractedMedicines)
      
      // Find nearby pharmacies if we have user location
      if (userLocation) {
        findNearbyPharmacies(userLocation)
      }
    } catch (err) {
      setError("Failed to process prescription. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const extractMedicineNames = (text: string): string[] => {
    // This is a simple implementation - you might want to use a more sophisticated approach
    const commonMedicinePrefixes = ["paracetamol", "amoxicillin", "ibuprofen", "aspirin", "metformin"]
    const words = text.toLowerCase().split(/\s+/)
    return words.filter(word => commonMedicinePrefixes.some(prefix => word.includes(prefix)))
  }

  const findNearbyPharmacies = async (location: { lat: number; lng: number }) => {
    if (!map) return

    try {
      const response = await fetch(`/api/nearby-pharmacies?lat=${location.lat}&lng=${location.lng}`)
      if (!response.ok) throw new Error('Failed to fetch pharmacies')
      
      const data = await response.json()
      const filteredPharmacies = data.pharmacies
        .filter((pharmacy: Pharmacy) => {
          // Filter by distance
          if (pharmacy.distance > maxDistance) return false
          
          // Filter by type if selected
          if (selectedTypes.length > 0) {
            return selectedTypes.some(type => pharmacy.types.includes(type))
          }
          
          // Filter by open status if selected
          if (showOnlyOpen && !pharmacy.isOpen) return false
          
          return true
        })
        .sort((a: Pharmacy, b: Pharmacy) => a.distance - b.distance)

      setPharmacies(filteredPharmacies)
      updateMapMarkers(filteredPharmacies)
    } catch (error) {
      console.error('Error finding pharmacies:', error)
      setError('Failed to find nearby pharmacies')
    }
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const updateMapMarkers = (pharmacyList: Pharmacy[]) => {
    if (!map) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    const newMarkers: google.maps.Marker[] = []

    pharmacyList.forEach(pharmacy => {
      // Create info window content
      const infoWindowContent = `
        <div class="p-2">
          <h3 class="font-semibold">${pharmacy.name}</h3>
          <p class="text-sm text-gray-600">${pharmacy.address}</p>
          <div class="mt-2 flex items-center gap-2">
            <span class="text-sm ${pharmacy.isOpen ? 'text-green-500' : 'text-red-500'}">
              ${pharmacy.isOpen ? 'Open' : 'Closed'}
            </span>
            <span class="text-sm text-gray-500">•</span>
            <span class="text-sm text-gray-500">${pharmacy.distance.toFixed(1)} km</span>
          </div>
        </div>
      `

      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
        maxWidth: 300,
      })

      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(pharmacy.location.lat, pharmacy.location.lng),
        map,
        title: pharmacy.name,
        icon: {
          url: "/pharmacy-marker.svg",
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32),
        },
        animation: google.maps.Animation.DROP,
      })

      // Add click listener for marker
      marker.addListener("click", () => {
        setSelectedPharmacy(pharmacy)
        map.panTo(new google.maps.LatLng(pharmacy.location.lat, pharmacy.location.lng))
        infoWindow.open(map, marker)
      })

      // Add hover listener for marker
      marker.addListener("mouseover", () => {
        marker.setAnimation(google.maps.Animation.BOUNCE)
      })

      marker.addListener("mouseout", () => {
        marker.setAnimation(null)
      })

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)
  }

  const {
    isDragging,
    error: uploadError,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileSelect,
  } = useFileUpload({
    onFileSelect: handleImageUpload,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="lazyOnload"
        onLoad={() => {
          // Initialize map when the script loads
          if (userLocation) {
            initializeMap(userLocation)
          }
        }}
      />
      <div className="container py-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MediSpot
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              Find nearby pharmacies and compare medication prices
            </p>
          </motion.div>

          {/* Main Content */}
          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Prescription</TabsTrigger>
              <TabsTrigger value="pharmacies">Nearby Pharmacies</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Upload Prescription</h2>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings2 className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-80 p-4 space-y-4">
                        <div className="space-y-2">
                          <Label>Image Scale</Label>
                          <Slider
                            value={[settings.scale]}
                            onValueChange={([value]) => setSettings({ ...settings, scale: value })}
                            min={0.5}
                            max={2}
                            step={0.1}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Margin (px)</Label>
                          <Slider
                            value={[settings.margin]}
                            onValueChange={([value]) => setSettings({ ...settings, margin: value })}
                            min={0}
                            max={50}
                            step={1}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Min Words Per Line</Label>
                          <Slider
                            value={[settings.minWordsPerLine]}
                            onValueChange={([value]) => setSettings({ ...settings, minWordsPerLine: value })}
                            min={1}
                            max={10}
                            step={1}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Text Scale</Label>
                          <Slider
                            value={[settings.textScale]}
                            onValueChange={([value]) => setSettings({ ...settings, textScale: value })}
                            min={0.5}
                            max={2}
                            step={0.1}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Use Dictionary</Label>
                          <Switch
                            checked={settings.useDictionary}
                            onCheckedChange={(checked) => setSettings({ ...settings, useDictionary: checked })}
                          />
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Card 
                      className={`p-8 cursor-pointer transition-colors ${
                        isDragging ? "bg-primary/10 border-primary" : "hover:bg-accent/50"
                      }`}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-primary/10">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-center space-y-1">
                          <span className="text-lg font-medium block">
                            {isDragging ? "Drop your prescription here" : "Upload Prescription"}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Drag and drop or click to select (max 5MB)
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </div>
                    </Card>
                  </motion.div>
                </Card>
              </motion.div>

              {/* Error Messages */}
              <AnimatePresence>
                {(error || uploadError) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Card className="p-4 bg-destructive/10 text-destructive">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error || uploadError}</span>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results Section */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <h2 className="text-xl font-semibold">Converted Text</h2>
                      </div>
                      <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap font-mono">
                        {result}
                      </div>
                      {medicines.length > 0 && (
                        <div className="mt-4">
                          <h3 className="font-semibold mb-2">Detected Medicines:</h3>
                          <div className="flex flex-wrap gap-2">
                            {medicines.map((medicine, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                              >
                                {medicine}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="pharmacies" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-6">
                  {/* Search and Filters */}
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Search pharmacies..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Button
                        onClick={() => userLocation && findNearbyPharmacies(userLocation)}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <Label>Store Types:</Label>
                        <div className="flex gap-2">
                          {['pharmacy', 'drugstore', 'medical_store', 'chemist', 'health_store'].map((type) => (
                            <Button
                              key={type}
                              variant={selectedTypes.includes(type) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                setSelectedTypes(prev =>
                                  prev.includes(type)
                                    ? prev.filter(t => t !== type)
                                    : [...prev, type]
                                )
                              }}
                            >
                              {type.replace('_', ' ')}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label>Max Distance:</Label>
                        <Slider
                          value={[maxDistance]}
                          onValueChange={([value]) => setMaxDistance(value)}
                          min={1}
                          max={20}
                          step={1}
                          className="w-[200px]"
                        />
                        <span className="text-sm text-muted-foreground">{maxDistance}km</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label>Show Only Open</Label>
                        <Switch
                          checked={showOnlyOpen}
                          onCheckedChange={setShowOnlyOpen}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Map */}
                    <div className="h-[500px] rounded-lg overflow-hidden">
                      <div id="map" className="w-full h-full" />
                    </div>

                    {/* Pharmacy List */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Nearby Medical Stores</h3>
                      <div className="space-y-4 max-h-[500px] overflow-y-auto">
                        {pharmacies.map((pharmacy, index) => (
                          <Card
                            key={index}
                            className={`p-4 cursor-pointer transition-colors ${
                              selectedPharmacy?.name === pharmacy.name
                                ? "border-primary bg-primary/5"
                                : "hover:bg-accent/50"
                            }`}
                            onClick={() => setSelectedPharmacy(pharmacy)}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{pharmacy.name}</h4>
                                <p className="text-sm text-muted-foreground">{pharmacy.address}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-sm text-muted-foreground">
                                    {pharmacy.distance.toFixed(1)} km away
                                  </span>
                                  <span className="text-sm text-muted-foreground">•</span>
                                  <span className="text-sm text-muted-foreground">
                                    Rating: {pharmacy.rating.toFixed(1)}
                                  </span>
                                  <span className="text-sm text-muted-foreground">•</span>
                                  <span className={`text-sm ${pharmacy.isOpen ? "text-green-500" : "text-red-500"}`}>
                                    {pharmacy.isOpen ? "Open" : "Closed"}
                                  </span>
                                </div>
                                {pharmacy.phone && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <a href={`tel:${pharmacy.phone}`} className="text-sm text-primary hover:underline">
                                      {pharmacy.phone}
                                    </a>
                                  </div>
                                )}
                              </div>
                              <MapPin className="h-5 w-5 text-primary" />
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="space-y-6">
                <NearbyPharmacies />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
} 