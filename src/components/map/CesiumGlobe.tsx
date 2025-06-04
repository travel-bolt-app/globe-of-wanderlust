
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Destination, AdventureLevel } from '../types';
import Earth from '../globe/Earth';
import { selectRandomDestination } from './utils/destinationUtils';
import SpinningIndicator from './SpinningIndicator';
import GlobeControls from './GlobeControls';
import { useState, useEffect } from 'react';

interface CesiumGlobeProps {
  selectedLevel: AdventureLevel | null;
  onDestinationSelected: (destination: Destination) => void;
  spinGlobe: boolean;
}

const CesiumGlobe: React.FC<CesiumGlobeProps> = ({
  selectedLevel,
  onDestinationSelected,
  spinGlobe
}) => {
  const [spinning, setSpinning] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // GitHub-style globe styling
  const globeStyles = {
    background: 'radial-gradient(circle at center, #0f172a 10%, #020617 70%)',
  };

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

  // Handle when spinning is complete
  const handleSpinComplete = () => {
    setSpinning(false);
    if (selectedDestination) {
      onDestinationSelected(selectedDestination);
    }
  };

  return (
    <div 
      className="relative w-full h-full" 
      ref={containerRef}
      style={globeStyles}
    >
      <Canvas 
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        className="absolute inset-0"
      >
        <Earth 
          selectedDestination={selectedDestination} 
          isSpinning={spinning}
          onSpinComplete={handleSpinComplete}
        />
        <OrbitControls 
          enableZoom={true}
          minDistance={1.5}
          maxDistance={4}
          enablePan={false}
          enableRotate={!spinning}
          autoRotate={false}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
        />
      </Canvas>
      <GlobeControls />
      <SpinningIndicator isVisible={spinning} />
    </div>
  );
};

export default CesiumGlobe;
