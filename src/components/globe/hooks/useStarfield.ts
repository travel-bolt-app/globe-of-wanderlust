
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { createStarfield } from '../utils';

export const useStarfield = () => {
  const { scene } = useThree();
  
  // Create starfield
  useEffect(() => {
    const stars = createStarfield(8000); // Increased star count
    scene.add(stars);
    
    // Log for debugging
    console.log("Starfield created and added to scene with updated parameters");
    
    return () => {
      scene.remove(stars);
    };
  }, [scene]);
};
