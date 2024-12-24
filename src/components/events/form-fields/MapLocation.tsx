import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";

interface MapLocationProps {
  value: string;
  onChange: (location: string) => void;
}

export function MapLocation({ value, onChange }: MapLocationProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState(value);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHFwOWd4Y2UwMGJqMmpxdDlocjNqYm95In0.1UtxUkTUxfhgaZtK8Bd9_g';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 0],
      zoom: 1
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Initialize marker
    marker.current = new mapboxgl.Marker({
      draggable: true,
      color: '#ef4444'
    });

    // Handle marker dragend
    marker.current.on('dragend', () => {
      const lngLat = marker.current?.getLngLat();
      if (lngLat) {
        fetchLocationName(lngLat.lng, lngLat.lat);
      }
    });

    // If there's an initial value, search for it
    if (value) {
      searchLocation(value, false);
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  const fetchLocationName = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const locationName = data.features[0].place_name;
        setSearchQuery(locationName);
        onChange(locationName);
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
      toast({
        title: "Error",
        description: "Failed to fetch location name. Please try again.",
        variant: "destructive",
      });
    }
  };

  const searchLocation = async (query: string, updateInput = true) => {
    if (!query || !map.current) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const locationName = data.features[0].place_name;
        
        map.current.flyTo({
          center: [lng, lat],
          zoom: 14,
          duration: 2000
        });

        marker.current?.setLngLat([lng, lat]).addTo(map.current);
        
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
    } catch (error) {
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
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <MapPin className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <div ref={mapContainer} className="h-[300px] w-full rounded-md" />
        </PopoverContent>
      </Popover>
    </div>
  );
}