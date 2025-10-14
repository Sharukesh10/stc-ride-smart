import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bike, MapPin, Shield, Zap, ChevronRight, ChevronLeft } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { useState, useEffect } from "react";

const Landing = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="min-h-screen bg-background relative">
      <Carousel setApi={setApi} className="w-full h-screen" opts={{ align: "start", loop: false }}>
        <CarouselContent className="h-screen">
          {/* Page 1: Hero */}
          <CarouselItem className="h-screen">
            <section className="relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
              <div className="container relative mx-auto px-4 h-full flex items-center">
                <div className="flex flex-col items-center text-center space-y-8 w-full">
                  <div className="space-y-4 max-w-3xl">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                      Your <span className="text-primary">Smart</span> Ride Companion
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      Rent e-bikes instantly. Park securely. Travel sustainably.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="text-lg px-8">
                      <Link to="/map">Find a Bike</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="text-lg px-8">
                      <Link to="/auth">Get Started</Link>
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl w-full">
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-primary">50+</div>
                      <div className="text-sm text-muted-foreground">Booths</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-primary">1000+</div>
                      <div className="text-sm text-muted-foreground">Riders</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-primary">24/7</div>
                      <div className="text-sm text-muted-foreground">Available</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>

          {/* Page 2: Features */}
          <CarouselItem className="h-screen">
            <section className="h-full bg-muted/30 flex items-center">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                  How It Works
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="flex flex-col items-center text-center space-y-4 p-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Find a Booth</h3>
                    <p className="text-muted-foreground">
                      Locate nearby STC booths on the map
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-4 p-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Quick Payment</h3>
                    <p className="text-muted-foreground">
                      Choose a plan and pay instantly
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-4 p-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bike className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Scan & Unlock</h3>
                    <p className="text-muted-foreground">
                      Scan QR code to unlock your ride
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-4 p-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Park Safely</h3>
                    <p className="text-muted-foreground">
                      Return to any booth and lock securely
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>

          {/* Page 3: CTA */}
          <CarouselItem className="h-screen">
            <section className="h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl p-12 text-center space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Ready to Ride?
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Join thousands of students choosing sustainable transportation
                  </p>
                  <Button asChild size="lg" className="text-lg px-8">
                    <Link to="/auth">Start Your Journey</Link>
                  </Button>
                </div>
              </div>
            </section>
          </CarouselItem>
        </CarouselContent>

        {/* Navigation Controls */}
        {current > 0 && (
          <button
            onClick={() => api?.scrollPrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg flex items-center justify-center hover:bg-background transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        
        {current < count - 1 && (
          <button
            onClick={() => api?.scrollNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg flex items-center justify-center hover:bg-background transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Page Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === current ? "bg-primary w-8" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default Landing;
