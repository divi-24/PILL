declare namespace google.maps {
  class Map {
    constructor(element: HTMLElement, options: MapOptions)
    panTo(latLng: LatLng): void
  }

  class Marker {
    constructor(options: MarkerOptions)
    setMap(map: Map | null): void
    addListener(event: string, handler: () => void): void
  }

  class LatLng {
    constructor(lat: number, lng: number)
    lat(): number
    lng(): number
  }

  class Size {
    constructor(width: number, height: number)
    width: number
    height: number
  }

  interface MapOptions {
    center: LatLng | { lat: number; lng: number }
    zoom: number
    styles?: MapStyle[]
  }

  interface MarkerOptions {
    position: LatLng | { lat: number; lng: number }
    map: Map
    title?: string
    icon?: {
      url: string
      scaledSize?: Size
    }
  }

  interface MapStyle {
    featureType?: string
    elementType?: string
    stylers?: { [key: string]: any }[]
  }

  namespace places {
    class PlacesService {
      constructor(map: Map)
      nearbySearch(
        request: PlacesSearchRequest,
        callback: (results: PlaceResult[] | null, status: PlacesServiceStatus) => void
      ): void
    }

    interface PlacesSearchRequest {
      location: LatLng | { lat: number; lng: number }
      radius: number
      type?: string[]
      keyword?: string
    }

    interface PlaceResult {
      name: string
      vicinity: string
      rating?: number
      geometry: {
        location: LatLng
      }
    }

    enum PlacesServiceStatus {
      OK = "OK",
      ZERO_RESULTS = "ZERO_RESULTS",
      OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
      REQUEST_DENIED = "REQUEST_DENIED",
      INVALID_REQUEST = "INVALID_REQUEST",
      UNKNOWN_ERROR = "UNKNOWN_ERROR"
    }
  }
} 