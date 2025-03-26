"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Phone, Globe, Clock, Star } from "lucide-react"
import { motion } from "framer-motion"

interface Pharmacy {
    id: string
    name: string
    address: string
    location: {
        lat: number
        lng: number
    }
    rating: number
    totalRatings: number
    isOpen: boolean
    phone: string
    website: string
    openingHours: string[]
    distance: number
}

export default function NearbyPharmacies() {
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

    useEffect(() => {
        // Get user's location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                    fetchNearbyPharmacies(position.coords.latitude, position.coords.longitude)
                },
                (error) => {
                    setError("Unable to get your location. Please enable location services.")
                    setLoading(false)
                }
            )
        } else {
            setError("Geolocation is not supported by your browser")
            setLoading(false)
        }
    }, [])

    const fetchNearbyPharmacies = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`/api/nearby-pharmacies?lat=${lat}&lng=${lng}`)
            if (!response.ok) {
                throw new Error('Failed to fetch nearby pharmacies')
            }
            const data = await response.json()
            setPharmacies(data.pharmacies)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const openInMaps = (lat: number, lng: number, name: string) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        window.open(url, '_blank')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <Card className="p-4">
                <div className="text-red-500">{error}</div>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Nearby Pharmacies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pharmacies.map((pharmacy) => (
                    <motion.div
                        key={pharmacy.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="p-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">{pharmacy.name}</h3>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm">{pharmacy.rating}</span>
                                        <span className="text-sm text-gray-500">
                                            ({pharmacy.totalRatings})
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>{pharmacy.address}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    <span className={pharmacy.isOpen ? "text-green-500" : "text-red-500"}>
                                        {pharmacy.isOpen ? "Open Now" : "Closed"}
                                    </span>
                                </div>

                                {pharmacy.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-4 h-4" />
                                        <a href={`tel:${pharmacy.phone}`} className="hover:text-primary">
                                            {pharmacy.phone}
                                        </a>
                                    </div>
                                )}

                                {pharmacy.website && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Globe className="w-4 h-4" />
                                        <a 
                                            href={pharmacy.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="hover:text-primary"
                                        >
                                            Visit Website
                                        </a>
                                    </div>
                                )}

                                <div className="text-sm text-gray-500">
                                    Distance: {pharmacy.distance.toFixed(1)} km
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full mt-2"
                                    onClick={() => openInMaps(pharmacy.location.lat, pharmacy.location.lng, pharmacy.name)}
                                >
                                    Open in Maps
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
} 