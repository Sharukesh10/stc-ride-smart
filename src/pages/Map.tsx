import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Bike, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MapView from "@/components/MapView";

interface Booth {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  available_bikes: number;
  total_capacity: number;
  status: string;
}

const Map = () => {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchBooths();
  }, [user, navigate]);

  const fetchBooths = async () => {
    try {
      const { data, error } = await supabase
        .from("booths")
        .select("*")
        .eq("status", "active")
        .order("name");

      if (error) throw error;
      setBooths(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load booths",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSelectBooth = (booth: Booth) => {
    setSelectedBooth(booth);
    if (booth.available_bikes > 0) {
      navigate("/booking", { state: { booth } });
    } else {
      toast({
        title: "No bikes available",
        description: "Please select another booth",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading booths...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">STC</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Navigation className="w-4 h-4 mr-2" />
              My Location
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 h-[calc(100vh-73px)]">
        {/* Booth List */}
        <div className="lg:col-span-1 overflow-y-auto border-r bg-muted/20">
          <div className="p-4 space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Nearby Booths</h2>
              <p className="text-sm text-muted-foreground">
                {booths.length} stations available
              </p>
            </div>

            {booths.map((booth) => (
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
                        {(Math.random() * 2).toFixed(1)} km
                      </CardDescription>
                    </div>
                    <Badge variant={booth.available_bikes > 10 ? "default" : booth.available_bikes > 5 ? "secondary" : "destructive"}>
                      {booth.available_bikes} bikes
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => handleSelectBooth(booth)}
                    disabled={booth.available_bikes === 0}
                  >
                    <Bike className="w-4 h-4 mr-2" />
                    {booth.available_bikes > 0 ? "Select Booth" : "No Bikes"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-2 relative">
          <MapView 
            booths={booths}
            selectedBooth={selectedBooth}
            onSelectBooth={handleSelectBooth}
          />
        </div>
      </div>
    </div>
  );
};

export default Map;
