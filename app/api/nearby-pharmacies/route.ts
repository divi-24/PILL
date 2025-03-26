import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');

        if (!lat || !lng) {
            return NextResponse.json(
                { error: "Latitude and longitude are required" },
                { status: 400 }
            );
        }

        // Search for multiple types of medical stores with increased radius
        const searchTypes = [
            'pharmacy',
            'drugstore',
            'medical_store',
            'chemist',
            'health_store'
        ];

        // Fetch results for each type and combine them
        const allResults = await Promise.all(
            searchTypes.map(async (type) => {
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
                    `location=${lat},${lng}&` +
                    `radius=10000&` + // Increased radius to 10km
                    `type=${type}&` +
                    `key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
                );
                const data = await response.json();
                return data.results || [];
            })
        );

        // Combine and deduplicate results
        const uniquePlaces = new Map();
        allResults.flat().forEach((place: any) => {
            if (!uniquePlaces.has(place.place_id)) {
                uniquePlaces.set(place.place_id, place);
            }
        });

        const pharmacies = Array.from(uniquePlaces.values()).map((place: any) => ({
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            location: {
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
            },
            rating: place.rating || 0,
            totalRatings: place.user_ratings_total || 0,
            isOpen: place.opening_hours?.open_now || false,
            phone: place.phone || '',
            website: place.website || '',
            openingHours: place.opening_hours?.weekday_text || [],
            distance: calculateDistance(
                parseFloat(lat),
                parseFloat(lng),
                place.geometry.location.lat,
                place.geometry.location.lng
            ),
            types: place.types || [],
        }));

        // Sort by distance
        pharmacies.sort((a, b) => a.distance - b.distance);

        return NextResponse.json({ pharmacies });
    } catch (error) {
        console.error('Error fetching nearby pharmacies:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
} 