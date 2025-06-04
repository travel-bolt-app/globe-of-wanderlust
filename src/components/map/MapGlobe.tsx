
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Destination, AdventureLevel } from '../types';
import { Compass } from 'lucide-react';

interface MapGlobeProps {
  selectedLevel: AdventureLevel | null;
  onDestinationSelected: (destination: Destination) => void;
  spinGlobe: boolean;
}

const MapGlobe = ({ selectedLevel, onDestinationSelected, spinGlobe }: MapGlobeProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Initialize the map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    const initMap = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json', // Free demo tiles
      zoom: 1.5,
      center: [0, 20],
      pitch: 45,
      attributionControl: false,
      antialias: true
    });

    // Add navigation controls
    initMap.addControl(
      new maplibregl.NavigationControl(),
      'top-right'
    );
    
    // Add atmosphere and fog effects
    initMap.on('load', () => {
      // Add some terrain if available
      try {
        initMap.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
          'tileSize': 256
        });
        initMap.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
      } catch (e) {
        console.warn("Terrain not supported or unavailable:", e);
      }
    });
    
    map.current = initMap;
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      map.current?.remove();
    };
  }, []);
  
  // Handle globe spinning
  useEffect(() => {
    const startSpin = () => {
      if (!map.current || !spinning) return;
      
      const spinGlobe = () => {
        if (!map.current || !spinning) return;
        
        const center = map.current.getCenter();
        center.lng -= 0.5; // Adjust speed
        map.current.jumpTo({ center });
        
        animationRef.current = requestAnimationFrame(spinGlobe);
      };
      
      spinGlobe();
    };
    
    if (spinning) {
      startSpin();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [spinning]);
  
  // Automatically trigger spinning when spinGlobe prop changes to true
  useEffect(() => {
    if (spinGlobe && selectedLevel && !spinning) {
      selectRandomDestination();
    }
  }, [spinGlobe, selectedLevel, spinning]);
  
  // Select a random destination based on the adventure level
  const selectRandomDestination = () => {
    if (!selectedLevel || spinning || !map.current) return;
    
    // Import destinations dynamically to avoid circular dependencies
    import('../globe/destinations').then(({ destinations }) => {
      // Filter destinations by selected adventure level
      const filteredDestinations = destinations.filter(d => d.level === selectedLevel);
      
      // No spinning animation if no valid destinations
      if (filteredDestinations.length === 0) return;
      
      setSpinning(true);
      setSelectedDestination(null);
      
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      
      // After a delay, select random destination
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * filteredDestinations.length);
        const destination = filteredDestinations[randomIndex];
        setSelectedDestination(destination);
        
        // Stop spinning and fly to destination
        setTimeout(() => {
          if (!map.current) return;
          
          setSpinning(false);
          const [lat, lng] = destination.coordinates;
          
          map.current.flyTo({
            center: [lng, lat],
            zoom: 4,
            speed: 1.2,
            curve: 1.42,
            essential: true
          });
          
          // Add marker after flying to destination
          setTimeout(() => {
            if (!map.current) return;
            
            // Create custom marker element
            const el = document.createElement('div');
            el.className = 'destination-marker';
            el.style.backgroundColor = '#EC4899';
            el.style.width = '20px';
            el.style.height = '20px';
            el.style.borderRadius = '50%';
            el.style.border = '2px solid white';
            el.style.boxShadow = '0 0 10px rgba(236, 72, 153, 0.7)';
            
            // Add pulse animation
            const pulse = document.createElement('div');
            pulse.className = 'pulse';
            pulse.style.animation = 'pulse 1.5s infinite';
            el.appendChild(pulse);
            
            // Create and add the marker
            marker.current = new maplibregl.Marker({ element: el })
              .setLngLat([lng, lat])
              .addTo(map.current);
            
            // Notify that a destination was selected
            onDestinationSelected(destination);
          }, 1000);
        }, 2000);
      }, 2000); // Spin for 2 seconds before selecting
    });
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(3);
              opacity: 0;
            }
          }
          .pulse {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: rgba(236, 72, 153, 0.4);
            z-index: -1;
          }
        `}
      </style>
      
      {/* Navigation header */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        {['compass', 'zoom-out', 'menu'].map((icon, index) => (
          <button 
            key={index} 
            className="w-10 h-10 rounded-md flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
          >
            {icon === 'compass' && <Compass />}
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

export default MapGlobe;
