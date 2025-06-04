
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EarthMeshProps {
  mapTexture: THREE.Texture | null;
  bumpTexture: THREE.Texture | null;
  isSpinning: boolean;
}

const EarthMesh = ({ mapTexture, bumpTexture, isSpinning }: EarthMeshProps) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const spinSpeedRef = useRef(0.05);
  
  // Effect to handle spin speed transitions
  useEffect(() => {
    if (isSpinning) {
      // Ramp up speed for spinning
      spinSpeedRef.current = 3;
    } else {
      // Ramp down speed for normal rotation
      spinSpeedRef.current = 0.05;
    }
  }, [isSpinning]);
  
  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * spinSpeedRef.current;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial 
        map={mapTexture}
        bumpMap={bumpTexture}
        bumpScale={0.05}
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  );
};

export default EarthMesh;
