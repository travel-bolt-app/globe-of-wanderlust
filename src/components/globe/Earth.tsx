
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Destination } from '../types';
import Atmosphere from './Atmosphere';
import { useEarthTextures } from './hooks/useEarthTextures';
import { useStarfield } from './hooks/useStarfield';
import { useMemo } from 'react';
import { createGlowMaterial, latLongToVector3 } from './utils';

interface EarthProps {
  selectedDestination: Destination | null;
  isSpinning: boolean;
  onSpinComplete: () => void;
}

const Earth: React.FC<EarthProps> = ({ selectedDestination, isSpinning, onSpinComplete }) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const { mapTexture, bumpTexture } = useEarthTextures();
  const stars = useStarfield();
  
  // Animation states
  const initialRotation = useRef<THREE.Vector3 | null>(null);
  const targetRotation = useRef<THREE.Vector3 | null>(null);
  const animationProgress = useRef(0);
  const spinCompleted = useRef(false);
  
  // Random data points for visualization
  const dataPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 30; i++) {
      const lat = Math.random() * 180 - 90;
      const lng = Math.random() * 360 - 180;
      const size = Math.random() * 0.02 + 0.005;
      points.push({ lat, lng, size });
    }
    return points;
  }, []);
  
  // Random connection arcs
  const connections = useMemo(() => {
    const arcs = [];
    for (let i = 0; i < 15; i++) {
      const startLat = Math.random() * 180 - 90;
      const startLng = Math.random() * 360 - 180;
      const endLat = Math.random() * 180 - 90;
      const endLng = Math.random() * 360 - 180;
      arcs.push({ startLat, startLng, endLat, endLng });
    }
    return arcs;
  }, []);

  // Setup camera and initial rotation
  useEffect(() => {
    if (earthRef.current) {
      initialRotation.current = new THREE.Vector3().copy(earthRef.current.rotation);
    }
  }, []);

  // Animation effect when destination changes
  useEffect(() => {
    if (selectedDestination && earthRef.current) {
      const [lat, lng] = selectedDestination.coordinates;
      
      // Convert to radians
      const latRad = lat * (Math.PI / 180);
      const lngRad = lng * (Math.PI / 180);
      
      // Calculate target rotation to face the destination
      const targetRot = new THREE.Vector3(
        -latRad, // X rotation (tilt)
        lngRad,  // Y rotation (spin)
        0        // Z rotation (keep level)
      );
      
      targetRotation.current = targetRot;
      animationProgress.current = 0;
      spinCompleted.current = false;
    }
  }, [selectedDestination]);

  // Animation frame loop
  useFrame((_, delta) => {
    if (earthRef.current) {
      if (isSpinning) {
        // Fast rotation during "spinning" phase
        earthRef.current.rotation.y += delta * 0.5;
      } else if (selectedDestination && !spinCompleted.current && targetRotation.current && initialRotation.current) {
        // Animate to target rotation when destination is selected
        animationProgress.current = Math.min(1, animationProgress.current + delta * 0.5);
        
        // Use LERP for smooth animation
        earthRef.current.rotation.x = THREE.MathUtils.lerp(
          initialRotation.current.x,
          targetRotation.current.x,
          animationProgress.current
        );
        
        earthRef.current.rotation.y = THREE.MathUtils.lerp(
          initialRotation.current.y,
          targetRotation.current.y,
          animationProgress.current
        );
        
        // Animation completed
        if (animationProgress.current >= 1) {
          spinCompleted.current = true;
          onSpinComplete();
        }
      } else {
        // Gentle ambient rotation when idle
        earthRef.current.rotation.y += delta * 0.1;
      }
    }
  });

  return (
    <>
      {/* Stars background */}
      {stars}
      
      {/* Earth mesh */}
      <mesh ref={earthRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          map={mapTexture} 
          bumpMap={bumpTexture} 
          bumpScale={0.05}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Atmosphere effect */}
      <Atmosphere />
      
      {/* Connection arcs */}
      {!isSpinning && connections.map((connection, index) => (
        <Arc 
          key={`arc-${index}`}
          startLat={connection.startLat} 
          startLng={connection.startLng} 
          endLat={connection.endLat} 
          endLng={connection.endLng} 
        />
      ))}
      
      {/* Data points */}
      {!isSpinning && <DataPoints points={dataPoints} />}
      
      {/* Destination pin */}
      {selectedDestination && !isSpinning && (
        <DestinationMarker destination={selectedDestination} />
      )}
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[5, 3, 5]} 
        intensity={0.8} 
        castShadow 
      />
    </>
  );
};

// Helper function to convert lat/long to cartesian coordinates
const latLongToCartesian = (lat: number, lng: number, radius: number = 1): [number, number, number] => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));
  
  return [x, y, z];
};

// Creates an arc between two points using a bezier curve
const createArcCurve = (startLat: number, startLng: number, endLat: number, endLng: number) => {
  const start = new THREE.Vector3(...latLongToCartesian(startLat, startLng, 1.02));
  const end = new THREE.Vector3(...latLongToCartesian(endLat, endLng, 1.02));
  
  // Calculate a midpoint that's elevated to create an arc
  const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const midElevation = 1.2; // Height of the arc
  midPoint.normalize().multiplyScalar(midElevation);
  
  // Create a quadratic bezier curve through these points
  return new THREE.QuadraticBezierCurve3(start, midPoint, end);
};

// Destination marker component
const DestinationMarker = ({ destination }: { destination: Destination }) => {
  const [lat, lng] = destination.coordinates;
  const position = useMemo(() => {
    return latLongToVector3(lat, lng, 1.02);
  }, [lat, lng]);
  
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.01, 0.05, 0.01]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
    </group>
  );
};

// Data points component
const DataPoints = ({ points }: { points: { lat: number, lng: number, size: number }[] }) => {
  return (
    <>
      {points.map((point, index) => (
        <mesh key={index} position={latLongToVector3(point.lat, point.lng, 1.02)}>
          <sphereGeometry args={[point.size, 8, 8]} />
          <meshStandardMaterial color="#38BDF8" emissive="#0EA5E9" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </>
  );
};

// Arc component
const Arc = ({ startLat, startLng, endLat, endLng }: { 
  startLat: number, startLng: number, endLat: number, endLng: number 
}) => {
  // Create points for the curve
  const points = useMemo(() => {
    // Create start and end points
    const start = new THREE.Vector3().fromArray(latLongToVector3(startLat, startLng, 1.02));
    const end = new THREE.Vector3().fromArray(latLongToVector3(endLat, endLng, 1.02));
    
    // Calculate a midpoint that's elevated to create an arc
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const midElevation = 1.2; // Height of the arc
    midPoint.normalize().multiplyScalar(midElevation);
    
    // Create a quadratic bezier curve through these points
    const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
    
    // Sample points along the curve
    return curve.getPoints(30);
  }, [startLat, startLng, endLat, endLng]);

  // Create the actual line geometry from these points
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  return (
    <primitive object={new THREE.Line(
      lineGeometry,
      new THREE.LineBasicMaterial({ color: '#38BDF8', opacity: 0.5, transparent: true })
    )} />
  );
};

export default Earth;
