import { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bike, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Booth {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  available_bikes: number;
  total_capacity: number;
  status: string;
}

interface MapViewProps {
  booths: Booth[];
  selectedBooth: Booth | null;
  onSelectBooth: (booth: Booth) => void;
}

const MapView = ({ booths, selectedBooth, onSelectBooth }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Leaflet dynamically
    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      // Fix default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const center: [number, number] = booths.length > 0 
        ? [booths[0].latitude, booths[0].longitude]
        : [28.6139, 77.2090];

      const map = L.map(mapRef.current).setView(center, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add markers for each booth
      booths.forEach((booth) => {
        const marker = L.marker([booth.latitude, booth.longitude])
          .addTo(map)
          .bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="font-weight: 600; font-size: 1.125rem; margin-bottom: 8px;">${booth.name}</h3>
              <p style="margin-bottom: 8px;">${booth.available_bikes} bikes available</p>
            </div>
          `);

        marker.on('click', () => {
          onSelectBooth(booth);
        });
      });

      // Pan to selected booth
      if (selectedBooth) {
        map.setView([selectedBooth.latitude, selectedBooth.longitude], 15);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [booths, selectedBooth, onSelectBooth]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full min-h-[400px]" />
      
      {selectedBooth && (
        <Card className="absolute bottom-4 left-4 right-4 lg:left-auto lg:w-80 z-[1000] shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-start justify-between">
              <span>{selectedBooth.name}</span>
              <Badge 
                variant={
                  selectedBooth.available_bikes > 10 
                    ? "default" 
                    : selectedBooth.available_bikes > 5 
                    ? "secondary" 
                    : "destructive"
                }
              >
                {selectedBooth.available_bikes} bikes
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => onSelectBooth(selectedBooth)}
              disabled={selectedBooth.available_bikes === 0}
            >
              <Bike className="w-4 h-4 mr-2" />
              {selectedBooth.available_bikes > 0 ? "Rent a Bike" : "No Bikes Available"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapView;
