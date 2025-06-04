
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Destination } from '../types';
import { latLongToVector3 } from './utils';

interface DestinationPinProps {
  destination: Destination | null;
  isSpinning: boolean;
  onPinPositioned: () => void;
}

const DestinationPin = ({ destination, isSpinning, onPinPositioned }: DestinationPinProps) => {
  const pinRef = useRef<THREE.Mesh>(null);
  const [showPin, setShowPin] = useState(false);
  const [positionedCalled, setPositionedCalled] = useState(false);

  // Reset pin when destination changes or spinning starts
  useEffect(() => {
    if (isSpinning) {
      setShowPin(false);
      setPositionedCalled(false);
    }
  }, [destination, isSpinning]);

  // Position the pin on the selected destination
  useEffect(() => {
    // Only run this effect when spinning stops and we have a destination
    if (destination && pinRef.current && !isSpinning && !positionedCalled) {
      const [lat, long] = destination.coordinates;
      const position = latLongToVector3(lat, long, 1.02); // Slightly above surface
      pinRef.current.position.copy(position);
      pinRef.current.lookAt(0, 0, 0); // Make it point toward the center
      
      // Short delay before showing pin and calling onPinPositioned
      setTimeout(() => {
        setShowPin(true);
        setPositionedCalled(true);
        // After positioning, notify that spinning is complete
        onPinPositioned();
      }, 100);
    }
  }, [destination, isSpinning, showPin, positionedCalled, onPinPositioned]);

  if (!destination) {
    return null;
  }

  return (
    <mesh 
      ref={pinRef} 
      scale={showPin ? 0.03 : 0}
      visible={showPin}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial>
        <color attach="color" args={["#EC4899"]} />
        <color attach="emissive" args={["#F9A8D4"]} />
      </meshStandardMaterial>
    </mesh>
  );
};

export default DestinationPin;
