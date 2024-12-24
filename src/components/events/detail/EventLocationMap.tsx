import { useEffect, useRef } from 'react';
import { useGoogleMapsKey } from '@/hooks/useGoogleMapsKey';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface EventLocationMapProps {
  location: string;
}

export function EventLocationMap({ location }: EventLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const apiKey = useGoogleMapsKey();

  useEffect(() => {
    if (!apiKey || !location || !mapRef.current) return;

    const loadMap = async () => {
      const { Loader } = await import('@googlemaps/js-api-loader');
      const loader = new Loader({
        apiKey,
        version: 'weekly',
      });

      const google = await loader.load();
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results && results[0] && mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: results[0].geometry.location,
            zoom: 15,
          });

          new google.maps.Marker({
            map,
            position: results[0].geometry.location,
          });
        }
      });
    };

    loadMap();
  }, [apiKey, location]);

  if (!apiKey) {
    return null;
  }

  if (!location) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <div ref={mapRef} className="w-full h-[300px]" />
    </Card>
  );
}