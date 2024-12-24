import { useEffect, useRef, useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

interface MapLocationProps {
  value: string;
  onChange: (location: string) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 0,
  lng: 0,
};

export function MapLocation({ value, onChange }: MapLocationProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  const [isSearching, setIsSearching] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const { toast } = useToast();
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (value && !searchQuery) {
      searchLocation(value, false);
    }
  }, [value]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    geocoder.current = new google.maps.Geocoder();
  }, []);

  const fetchLocationName = async (lat: number, lng: number) => {
    if (!geocoder.current) return;

    setIsSearching(true);
    try {
      const result = await geocoder.current.geocode({
        location: { lat, lng }
      });

      if (result.results[0]) {
        const locationName = result.results[0].formatted_address;
        setSearchQuery(locationName);
        onChange(locationName);
        setMarkerPosition({ lat, lng });
      }
    } catch (error: any) {
      console.error('Error fetching location name:', error);
      toast({
        title: "Error",
        description: "Failed to fetch location name. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const searchLocation = async (query: string, updateInput = true) => {
    if (!query || !geocoder.current) return;

    setIsSearching(true);
    try {
      const result = await geocoder.current.geocode({ address: query });

      if (result.results[0]) {
        const { lat, lng } = result.results[0].geometry.location.toJSON();
        const locationName = result.results[0].formatted_address;
        
        setCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
        
        if (updateInput) {
          setSearchQuery(locationName);
          onChange(locationName);
        }
      } else {
        toast({
          title: "Location not found",
          description: "Please try a different search term.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error searching location:', error);
      toast({
        title: "Error",
        description: "Failed to search location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const { lat, lng } = event.latLng.toJSON();
      fetchLocationName(lat, lng);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchLocation(searchQuery)}
          className="pr-10"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      <Popover open={isMapOpen} onOpenChange={setIsMapOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <MapPin className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0" align="end">
          <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={markerPosition ? 14 : 1}
              onClick={handleMapClick}
              onLoad={onMapLoad}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {markerPosition && (
                <Marker
                  position={markerPosition}
                  draggable={true}
                  onDragEnd={(e) => {
                    if (e.latLng) {
                      const { lat, lng } = e.latLng.toJSON();
                      fetchLocationName(lat, lng);
                    }
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>
          <div className="p-3 bg-muted/50 text-xs text-muted-foreground">
            Click on the map or drag the marker to select a location
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}