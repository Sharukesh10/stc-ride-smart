import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Bike, ArrowLeft } from "lucide-react";

// Mock booth data
const mockBooths = [
  { id: 1, name: "Main Campus Gate", bikes: 12, distance: "0.5 km", lat: 28.6139, lng: 77.2090 },
  { id: 2, name: "Library Block", bikes: 8, distance: "0.8 km", lat: 28.6149, lng: 77.2095 },
  { id: 3, name: "Cafeteria", bikes: 15, distance: "1.2 km", lat: 28.6129, lng: 77.2100 },
  { id: 4, name: "Sports Complex", bikes: 5, distance: "1.5 km", lat: 28.6119, lng: 77.2085 },
];

const Map = () => {
  const [selectedBooth, setSelectedBooth] = useState<typeof mockBooths[0] | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">STC</span>
          </Link>
          <Button variant="outline" size="sm">
            <Navigation className="w-4 h-4 mr-2" />
            My Location
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 h-[calc(100vh-73px)]">
        {/* Booth List */}
        <div className="lg:col-span-1 overflow-y-auto border-r bg-muted/20">
          <div className="p-4 space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Nearby Booths</h2>
              <p className="text-sm text-muted-foreground">
                {mockBooths.length} stations available
              </p>
            </div>

            {mockBooths.map((booth) => (
              <Card
                key={booth.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedBooth?.id === booth.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedBooth(booth)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{booth.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {booth.distance}
                      </CardDescription>
                    </div>
                    <Badge variant={booth.bikes > 10 ? "default" : booth.bikes > 5 ? "secondary" : "destructive"}>
                      {booth.bikes} bikes
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="sm">
                    <Bike className="w-4 h-4 mr-2" />
                    Select Booth
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-2 relative">
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
            <div className="text-center space-y-4 p-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
                <p className="text-muted-foreground max-w-md">
                  Google Maps integration will show booth locations and navigation here
                </p>
              </div>
              {selectedBooth && (
                <Card className="max-w-sm mx-auto">
                  <CardHeader>
                    <CardTitle>{selectedBooth.name}</CardTitle>
                    <CardDescription>
                      {selectedBooth.bikes} bikes available • {selectedBooth.distance} away
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" asChild>
                      <Link to="/booking">Rent a Bike</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
