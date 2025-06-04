
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Destination, AdventureLevel } from '../types';
import { useToast } from '@/components/ui/use-toast';
import { selectRandomDestination } from './utils/destinationUtils';
import SpinningIndicator from './SpinningIndicator';

// Define map container style
const containerStyle = {
  width: '100%',
  height: '100%'
};

// Default center position (can be adjusted as needed)
const center = {
  lat: 20,
  lng: 0
};

// Replace this with your actual Google Maps API key
// For security, you should consider using environment variables in a production app
const GOOGLE_MAPS_API_KEY = '';

interface GoogleMapProps {
  selectedLevel: AdventureLevel | null;
  onDestinationSelected: (destination: Destination) => void;
  spinGlobe: boolean;
}

const GoogleMapComponent: React.FC<GoogleMapProps> = ({
  selectedLevel,
  onDestinationSelected,
  spinGlobe
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const { toast } = useToast();
  
  // Load the Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || 'AIzaSyDDVESfJ91u5V8bzwyCWBjH0e4dHAgRyNQ', // Fallback to demo key
  });

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    // Customize map style - similar to GitHub's dark theme
    map.setOptions({
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry',
          stylers: [{ color: '#242f3e' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#242f3e' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#746855' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#0f172a' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#515c6d' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#17263c' }]
        }
      ]
    });
    
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  // Handle globe spinning and destination selection
  useEffect(() => {
    if (spinGlobe && selectedLevel && !spinning) {
      handleSelectRandomDestination();
    }
  }, [spinGlobe, selectedLevel, spinning]);

  // Select and animate to random destination
  const handleSelectRandomDestination = () => {
    if (!selectedLevel || spinning || !map) return;
    
    setSpinning(true);
    setSelectedDestination(null);
    
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
        
        // Animate map to the destination
        const [lat, lng] = destination.coordinates;
        map.panTo({ lat, lng });
        map.setZoom(6); // Zoom in to the destination
        
        // Stop spinning and notify parent
        setTimeout(() => {
          setSpinning(false);
          onDestinationSelected(destination);
        }, 1000);
      }, 2000); // Delay for 2 seconds before selecting
    });
  };

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-globe-background text-white p-6">
        <div className="max-w-md text-center">
          <h3 className="text-xl font-bold mb-4">Error Loading Map</h3>
          <p className="mb-4">There was an error loading the Google Maps API.</p>
          <div className="p-4 bg-red-900/30 border border-red-500/30 rounded-md text-left">
            <p className="font-mono text-sm">{loadError.message}</p>
          </div>
          <p className="mt-6">
            Please check your Google Maps API key configuration in the README.md file.
          </p>
        </div>
      </div>
    );
  }

  return isLoaded ? (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={2}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          backgroundColor: '#0f172a',
        }}
      >
        {/* Display marker for selected destination */}
        {selectedDestination && (
          <Marker
            position={{
              lat: selectedDestination.coordinates[0],
              lng: selectedDestination.coordinates[1]
            }}
            animation={google.maps.Animation.DROP}
          />
        )}
      </GoogleMap>
      <SpinningIndicator isVisible={spinning} />
    </div>
  ) : (
    <div className="flex items-center justify-center w-full h-full bg-globe-background text-white">
      <p>Loading Map...</p>
    </div>
  );
};

export default GoogleMapComponent;
