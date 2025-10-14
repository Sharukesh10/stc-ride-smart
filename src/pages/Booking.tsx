import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, IndianRupee } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Booth {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  available_bikes: number;
  total_capacity: number;
  status: string;
}

// Base price per km
const PRICE_PER_KM = 10;

const Booking = () => {
  const [selectedDropBooth, setSelectedDropBooth] = useState<string>("");
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const pickupBooth = location.state?.booth as Booth;

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!pickupBooth) {
      navigate("/map");
      return;
    }
    
    fetchBooths();
  }, [user, pickupBooth, navigate]);

  const fetchBooths = async () => {
    try {
      const { data, error } = await supabase
        .from("booths")
        .select("*")
        .eq("status", "active")
        .neq("id", pickupBooth.id)
        .order("name");

      if (error) throw error;
      setBooths(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load drop booths",
        variant: "destructive",
      });
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Haversine formula to calculate distance between two coordinates
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const selectedDropBoothData = booths.find(b => b.id === selectedDropBooth);
  
  const distance = selectedDropBoothData 
    ? calculateDistance(
        pickupBooth.latitude,
        pickupBooth.longitude,
        selectedDropBoothData.latitude,
        selectedDropBoothData.longitude
      )
    : 0;

  const calculatedPrice = Math.min(Math.max(Math.ceil(distance * PRICE_PER_KM), 10), 20);

  const handlePayment = async () => {
    if (!user || !pickupBooth || !selectedDropBooth) {
      toast({
        title: "Missing Information",
        description: "Please select a drop booth",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          pickup_booth_id: pickupBooth.id,
          drop_booth_id: selectedDropBooth,
          price: calculatedPrice,
          status: "pending",
          qr_code: `STC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking Created!",
        description: "Payment integration will be added next. For now, your booking is pending.",
      });

      // In production, this would redirect to payment gateway
      // For now, just show success
      setTimeout(() => {
        navigate("/map");
      }, 2000);

    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!pickupBooth) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link to="/map" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Map</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Choose Drop Location</h1>
            <p className="text-muted-foreground">Select where you want to drop the bike</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pickup Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-medium">{pickupBooth.name}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Drop Location</CardTitle>
              <CardDescription>Select your destination booth</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedDropBooth} onValueChange={setSelectedDropBooth} className="space-y-3">
                {booths.map((booth) => (
                  <div key={booth.id} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={booth.id} id={booth.id} />
                    <Label htmlFor={booth.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{booth.name}</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup Booth</span>
                <span className="font-medium">{pickupBooth.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Drop Booth</span>
                <span className="font-medium">{selectedDropBoothData?.name || "Not selected"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Distance</span>
                <span className="font-medium">{distance > 0 ? `${distance.toFixed(1)} km` : "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available Bikes</span>
                <span className="font-medium">{pickupBooth.available_bikes} bikes</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-5 h-5" />
                  {calculatedPrice > 0 ? calculatedPrice : "-"}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handlePayment}
                disabled={loading || !selectedDropBooth}
              >
                {loading ? "Creating Booking..." : "Proceed to Payment"}
              </Button>
            </CardFooter>
          </Card>

          <p className="text-sm text-muted-foreground text-center">
            Payment gateway integration (Razorpay/UPI) will be added next
          </p>
        </div>
      </div>
    </div>
  );
};

export default Booking;
