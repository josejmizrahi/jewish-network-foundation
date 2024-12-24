import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MapLocationProps {
  value: string;
  onChange: (location: string) => void;
}

export function MapLocation({ value, onChange }: MapLocationProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState(value);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHFwOWd4Y2UwMGJqMmpxdDlocjNqYm95In0.1UtxUkTUxfhgaZtK8Bd9_g';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40],
      zoom: 9
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Initialize marker
    marker.current = new mapboxgl.Marker({
      draggable: true
    });

    // Handle marker dragend
    marker.current.on('dragend', () => {
      const lngLat = marker.current?.getLngLat();
      if (lngLat) {
        fetchLocationName(lngLat.lng, lngLat.lat);
      }
    });

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
    }
  };

  const searchLocation = async () => {
    if (!searchQuery || !map.current) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        
        map.current.flyTo({
          center: [lng, lat],
          zoom: 14
        });

        marker.current?.setLngLat([lng, lat]).addTo(map.current);
        
        const locationName = data.features[0].place_name;
        setSearchQuery(locationName);
        onChange(locationName);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter location"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && searchLocation()}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <MapPin className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <div ref={mapContainer} className="h-[300px] w-full rounded-md" />
        </PopoverContent>
      </Popover>
    </div>
  );
}