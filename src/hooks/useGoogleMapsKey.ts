import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useGoogleMapsKey() {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const fetchApiKey = async () => {
      const { data: { GOOGLE_MAPS_API_KEY } } = await supabase.functions.invoke('get-google-maps-key');
      if (GOOGLE_MAPS_API_KEY) {
        setApiKey(GOOGLE_MAPS_API_KEY);
      }
    };

    fetchApiKey();
  }, []);

  return apiKey;
}