import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bike } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  const mapRef = useRef<L.Map | null>(null);
  
  const center: [number, number] = booths.length > 0 
    ? [booths[0].latitude, booths[0].longitude]
    : [28.6139, 77.2090]; // Default center

  useEffect(() => {
    if (mapRef.current && selectedBooth) {
      mapRef.current.setView([selectedBooth.latitude, selectedBooth.longitude], 15);
    }
  }, [selectedBooth]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {booths.map((booth) => (
        <Marker
          key={booth.id}
          position={[booth.latitude, booth.longitude]}
          eventHandlers={{
            click: () => onSelectBooth(booth),
          }}
        >
          <Popup>
            <div className="space-y-2 min-w-[200px]">
              <h3 className="font-semibold text-lg">{booth.name}</h3>
              <Badge 
                variant={
                  booth.available_bikes > 10 
                    ? "default" 
                    : booth.available_bikes > 5 
                    ? "secondary" 
                    : "destructive"
                }
              >
                {booth.available_bikes} bikes available
              </Badge>
              <Button 
                className="w-full" 
                size="sm"
                onClick={() => onSelectBooth(booth)}
                disabled={booth.available_bikes === 0}
              >
                <Bike className="w-4 h-4 mr-2" />
                {booth.available_bikes > 0 ? "Select Booth" : "No Bikes"}
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
