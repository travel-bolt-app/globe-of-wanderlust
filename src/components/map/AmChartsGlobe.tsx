
import React, { useState, useEffect } from 'react';
import { Destination, AdventureLevel } from '../types';
import { selectRandomDestination } from './utils/destinationUtils';
import SpinningIndicator from './SpinningIndicator';
import GlobeControls from './GlobeControls';

interface AmChartsGlobeProps {
  selectedLevel: AdventureLevel | null;
  onDestinationSelected: (destination: Destination) => void;
  spinGlobe: boolean;
}

const AmChartsGlobe = ({ 
  selectedLevel, 
  onDestinationSelected, 
  spinGlobe 
}: AmChartsGlobeProps) => {
  const [spinning, setSpinning] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const chartDivRef = React.useRef<HTMLDivElement>(null);

  // Handle globe spinning and destination selection
  useEffect(() => {
    if (spinGlobe && selectedLevel && !spinning) {
      handleSelectRandomDestination();
    }
  }, [spinGlobe, selectedLevel, spinning]);

  // Select and animate to random destination
  const handleSelectRandomDestination = () => {
    if (!selectedLevel || spinning) return;
    
    setSpinning(true);
    setSelectedDestination(null);
    
    // Import destinations dynamically to avoid circular dependencies
    import('../globe/destinations').then(({ destinations }) => {
      // Get random destination
      const destination = selectRandomDestination(destinations, selectedLevel);
      
      // No spinning animation if no valid destinations
      if (!destination) {
        setSpinning(false);
        return;
      }
      
      // After a delay, select the destination
      setTimeout(() => {
        setSelectedDestination(destination);
        
        // Stop spinning and fly to destination
        setTimeout(() => {
          setSpinning(false);
          
          // Notify that a destination was selected
          onDestinationSelected(destination);
        }, 2000);
      }, 2000); // Spin for 2 seconds before selecting
    });
  };

  // Function to simulate navigating to a destination
  const navigateToDestination = (destination: Destination) => {
    console.log(`Navigating to: ${destination.name}, ${destination.country}`);
    // This would be where animation code would go if we were using AMCharts
  };

  return (
    <div className="relative w-full h-full">
      <div ref={chartDivRef} className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-blue-900 to-black">
        <div className="text-white text-opacity-50">
          Using Three.js Globe Implementation
        </div>
      </div>
      <GlobeControls />
      <SpinningIndicator isVisible={spinning} />
    </div>
  );
};

export default AmChartsGlobe;
