
import React, { useState, useEffect } from 'react';
import { AdventureLevel, Destination } from '@/components/types';
import AdventureLevelSelector from '@/components/AdventureLevelSelector';
import LocationInfo from '@/components/LocationInfo';
import LoadingScreen from '@/components/LoadingScreen';
import { useToast } from '@/components/ui/use-toast';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MapboxMap from '@/components/map/MapboxMap';
import MapboxControls from '@/components/map/MapboxControls';

const Index = () => {
  const [selectedLevel, setSelectedLevel] = useState<AdventureLevel | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [spinGlobe, setSpinGlobe] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toast = useToast();

  // Simulate loading
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + (100 - prev) / 10;
        if (newProgress >= 99) {
          clearInterval(interval);
          // A small delay before removing the loading screen completely
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleLevelSelect = (level: AdventureLevel) => {
    setSelectedLevel(level);
    // Clear any previous destination when changing levels
    setSelectedDestination(null);

    // Trigger the map animation when a level is selected
    setSpinGlobe(true);
    // Close the sidebar after selecting
    setSidebarOpen(false);
    toast.toast({
      title: `${level.charAt(0).toUpperCase() + level.slice(1)} adventure selected`,
      description: `Finding your destination...`,
      duration: 3000
    });
  };

  const handleDestinationSelected = (destination: Destination) => {
    setSelectedDestination(destination);
    // Reset the spin trigger after destination is found
    setSpinGlobe(false);
    toast.toast({
      title: "Destination Found!",
      description: `${destination.name}, ${destination.country}`,
      duration: 5000
    });
  };

  if (loading) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-globe-background">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-globe-background via-globe-background to-black z-0"></div>
      
      {/* Navigation header */}
      <header className="absolute top-0 left-0 right-0 p-4 z-30 flex items-center justify-between">
        {/* Adventure panel trigger */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-black/40 border border-white/20 backdrop-blur-md text-white hover:bg-black/60 hover:text-blue-300 animate-pulse-glow">
              <Compass className="h-5 w-5" />
              <span className="sr-only">Choose Adventure</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 sm:w-96 border-l border-white/10 bg-black/80 backdrop-blur-lg p-0">
            <div className="h-full overflow-y-auto py-6">
              <AdventureLevelSelector onLevelSelect={handleLevelSelect} selectedLevel={selectedLevel} />
            </div>
          </SheetContent>
        </Sheet>
      </header>
      
      {/* Using Mapbox Map */}
      <MapboxMap 
        selectedLevel={selectedLevel} 
        onDestinationSelected={handleDestinationSelected} 
        spinGlobe={spinGlobe} 
      />
      
      {/* Map controls */}
      <MapboxControls />
      
      {/* Location info displayed as a popup card */}
      {selectedDestination && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 max-w-md w-full">
          <LocationInfo destination={selectedDestination} />
        </div>
      )}
    </div>
  );
};

export default Index;
