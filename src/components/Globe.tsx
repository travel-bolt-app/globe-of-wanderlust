
import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Destination, AdventureLevel } from './types';
import Earth from './globe/Earth';
import { destinations } from './globe/destinations';
import { MapPin, Globe as GlobeIcon } from 'lucide-react';

// Main Globe component with controls
const Globe = ({ 
  selectedLevel,
  onDestinationSelected,
  spinGlobe
}: { 
  selectedLevel: AdventureLevel | null,
  onDestinationSelected: (destination: Destination) => void,
  spinGlobe: boolean
}) => {
  // Fixed: Moved useState hooks inside the component function body
  const [spinning, setSpinning] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Automatically trigger spinning when spinGlobe prop changes to true
  useEffect(() => {
    if (spinGlobe && selectedLevel && !spinning) {
      selectRandomDestination();
    }
  }, [spinGlobe, selectedLevel, spinning]);

  // Select a random destination based on the adventure level
  const selectRandomDestination = () => {
    if (!selectedLevel || spinning) return;
    
    // Filter destinations by selected adventure level
    const filteredDestinations = destinations.filter(d => d.level === selectedLevel);
    
    // No spinning animation if no valid destinations
    if (filteredDestinations.length === 0) return;
    
    setSpinning(true);
    setSelectedDestination(null);
    
    // After a delay, select random destination
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredDestinations.length);
      const destination = filteredDestinations[randomIndex];
      setSelectedDestination(destination);
    }, 2000); // Spin for 2 seconds before selecting
  };

  // Called when spinning is complete
  const handleSpinComplete = () => {
    setSpinning(false);
    if (selectedDestination) {
      onDestinationSelected(selectedDestination);
    }
  };

  return (
    <div className="canvas-container relative w-full h-full" ref={canvasContainerRef}>
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
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
          zoomSpeed={0.5}
        />
      </Canvas>
      
      {/* Fixed navigation elements using the provided UI style */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        {['zoom-in', 'zoom-out', 'menu'].map((icon, index) => (
          <button 
            key={index} 
            className="w-10 h-10 rounded-md flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
          >
            {icon === 'zoom-in' && <MapPin />}
            {icon === 'zoom-out' && <MapPin className="opacity-50" />}
            {icon === 'menu' && <GlobeIcon />}
          </button>
        ))}
      </div>
      
      {/* Status indicator that shows when globe is spinning */}
      {spinning && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 bg-black/60 text-white px-6 py-2 rounded-full backdrop-blur-sm flex items-center gap-2 animate-pulse">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
          <span>Finding destination...</span>
        </div>
      )}
    </div>
  );
};

export default Globe;
