import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Clock, IndianRupee } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const plans = [
  { id: "30min", duration: "30 Minutes", price: 20 },
  { id: "1hr", duration: "1 Hour", price: 35 },
  { id: "2hr", duration: "2 Hours", price: 60 },
  { id: "4hr", duration: "4 Hours", price: 100 },
];

const Booking = () => {
  const [selectedPlan, setSelectedPlan] = useState("1hr");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const booth = location.state?.booth;

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
    if (!booth) {
      navigate("/map");
    }
  }, [user, booth, navigate]);

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  const handlePayment = async () => {
    if (!user || !booth) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          booth_id: booth.id,
          plan_duration: selectedPlan,
          price: selectedPlanData?.price,
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

  if (!booth) return null;

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
            <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
            <p className="text-muted-foreground">Select rental duration and proceed to payment</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rental Plans</CardTitle>
              <CardDescription>Pick the duration that suits your journey</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-3">
                {plans.map((plan) => (
                  <div key={plan.id} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={plan.id} id={plan.id} />
                    <Label htmlFor={plan.id} className="flex-1 cursor-pointer flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{plan.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 text-lg font-semibold">
                        <IndianRupee className="w-4 h-4" />
                        {plan.price}
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
                <span className="text-muted-foreground">Booth</span>
                <span className="font-medium">{booth.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{selectedPlanData?.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available Bikes</span>
                <span className="font-medium">{booth.available_bikes} bikes</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-5 h-5" />
                  {selectedPlanData?.price}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handlePayment}
                disabled={loading}
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
