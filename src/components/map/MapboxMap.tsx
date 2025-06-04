
import React, { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AdventureLevel, Destination } from '../types';
import { useToast } from '@/components/ui/use-toast';
import { selectRandomDestination } from './utils/destinationUtils';
import SpinningIndicator from './SpinningIndicator';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2N0ZW8iLCJhIjoiY21hbmNhdnc1MGJvbzJqcHdieDh1czRhNiJ9.NJiaJckrjwt9Izz7kp_zjw';

interface MapboxMapProps {
  selectedLevel: AdventureLevel | null;
  onDestinationSelected: (destination: Destination) => void;
  spinGlobe: boolean;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  selectedLevel,
  onDestinationSelected,
  spinGlobe
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();
  const rotationInterval = useRef<number | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const initMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Dark theme similar to previous design
      center: [0, 20],
      zoom: 1.5,
      projection: 'globe',
      pitch: 45
    });

    initMap.on('load', () => {
      setMapLoaded(true);
      
      // Add atmosphere and fog for a more immersive experience
      initMap.setFog({
        color: 'rgb(15, 23, 42)', // dark blue
        'high-color': 'rgb(10, 15, 30)',
        'horizon-blend': 0.2,
        'space-color': 'rgb(5, 5, 15)',
        'star-intensity': 0.6
      });
      
      // Add stars in the background
      initMap.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15
        }
      });
    });

    // Add navigation controls
    initMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current = initMap;

    return () => {
      if (rotationInterval.current) {
        clearInterval(rotationInterval.current);
      }
      initMap.remove();
    };
  }, []);

  // Handle globe spinning
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (spinning) {
      // Start rotating the globe
      if (!rotationInterval.current) {
        rotationInterval.current = window.setInterval(() => {
          if (map.current) {
            const currentCenter = map.current.getCenter();
            currentCenter.lng -= 0.5; // Rotate speed
            map.current.setCenter(currentCenter);
          }
        }, 100);
      }
    } else {
      // Stop rotation
      if (rotationInterval.current) {
        clearInterval(rotationInterval.current);
        rotationInterval.current = null;
      }
    }

    return () => {
      if (rotationInterval.current) {
        clearInterval(rotationInterval.current);
        rotationInterval.current = null;
      }
    };
  }, [spinning, mapLoaded]);

  // Automatically trigger spinning when spinGlobe prop changes to true
  useEffect(() => {
    if (spinGlobe && selectedLevel && !spinning && mapLoaded) {
      handleSelectRandomDestination();
    }
  }, [spinGlobe, selectedLevel, spinning, mapLoaded]);

  // Select a random destination based on the adventure level
  const handleSelectRandomDestination = useCallback(() => {
    if (!selectedLevel || spinning || !map.current || !mapLoaded) return;

    // Start spinning animation
    setSpinning(true);
    setSelectedDestination(null);
    
    // Remove any existing markers
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }

    // Import destinations dynamically to avoid circular dependencies
    import('../globe/destinations').then(({ destinations }) => {
      // Get random destination
      const destination = selectRandomDestination(destinations, selectedLevel);
      
      // No animation if no valid destinations
      if (!destination) {
        setSpinning(false);
        return;
      }
      
      // After a delay, select the destination (simulating the "spinning" effect)
      setTimeout(() => {
        setSelectedDestination(destination);
        
        const [lat, lng] = destination.coordinates;
        
        // Stop spinning and fly to destination
        setTimeout(() => {
          setSpinning(false);
          
          // Animate to destination with a nice curve
          map.current?.flyTo({
            center: [lng, lat],
            zoom: 6,
            speed: 0.8,
            curve: 1.2,
            easing: (t) => t,
            essential: true
          });
          
          // Add marker after flying to destination
          setTimeout(() => {
            // Create a custom HTML element for the marker
            const el = document.createElement('div');
            el.className = 'custom-marker';
            
            // Add pulse effect
            const pulse = document.createElement('div');
            pulse.className = 'pulse';
            el.appendChild(pulse);
            
            // Create the marker
            marker.current = new mapboxgl.Marker(el)
              .setLngLat([lng, lat])
              .addTo(map.current!);
            
            // Create a popup with destination information
            const popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="mapbox-popup">
                  <h3>${destination.name}</h3>
                  <p>${destination.country}</p>
                  <span class="tag">${destination.level} adventure</span>
                </div>
              `);
            
            // Add popup to marker
            marker.current.setPopup(popup);
            
            // Notify that a destination was selected
            onDestinationSelected(destination);
          }, 1000);
        }, 2000);
      }, 2000); // Spin for 2 seconds before selecting
    });
  }, [selectedLevel, spinning, mapLoaded, onDestinationSelected]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      <SpinningIndicator isVisible={spinning} />
      
      <style jsx global>{`
        .custom-marker {
          background-color: #EC4899;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.7);
          cursor: pointer;
          position: relative;
        }
        
        .pulse {
          background-color: rgba(236, 72, 153, 0.4);
          border-radius: 50%;
          height: 100%;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: -1;
          animation: pulse 2s infinite;
        }
        
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
        
        .mapbox-popup {
          color: white;
          padding: 5px 10px;
        }
        
        .mapbox-popup h3 {
          margin: 0 0 5px 0;
          font-weight: bold;
        }
        
        .mapbox-popup p {
          margin: 0 0 8px 0;
        }
        
        .mapbox-popup .tag {
          display: inline-block;
          background: rgba(59, 130, 246, 0.3);
          color: #93c5fd;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          text-transform: capitalize;
        }
        
        .mapboxgl-popup {
          max-width: 200px;
        }
        
        .mapboxgl-popup-content {
          background: rgba(17, 24, 39, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          backdrop-filter: blur(4px);
        }
        
        .mapboxgl-popup-tip {
          border-top-color: rgba(17, 24, 39, 0.9) !important;
          border-bottom-color: rgba(17, 24, 39, 0.9) !important;
        }
      `}</style>
    </div>
  );
};

export default MapboxMap;
