
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { createDetailedEarthTexture, createEarthBumpMap } from '../utils';

export const useEarthTextures = () => {
  const [mapTexture, setMapTexture] = useState<THREE.Texture | null>(null);
  const [bumpTexture, setBumpTexture] = useState<THREE.Texture | null>(null);
  const [texturesLoaded, setTexturesLoaded] = useState(false);

  useEffect(() => {
    console.log("Loading Earth textures...");
    const textureLoader = new THREE.TextureLoader();
    
    // Create procedural textures immediately as fallback
    const fallbackTexture = createDetailedEarthTexture();
    const fallbackBumpMap = createEarthBumpMap();
    
    // Set up a timeout to ensure we have textures even if loading fails
    const timeoutId = setTimeout(() => {
      console.log("Using procedural textures as fallback");
      setMapTexture(fallbackTexture);
      setBumpTexture(fallbackBumpMap);
      setTexturesLoaded(true);
    }, 2000);
    
    // Try to load image textures
    textureLoader.load(
      '/earth_map.jpg',
      (texture) => {
        console.log("Earth texture loaded successfully from image");
        clearTimeout(timeoutId);
        setMapTexture(texture);
        setTexturesLoaded(true);
      },
      (progressEvent) => {
        console.log("Loading texture progress:", progressEvent);
      },
      (error) => {
        console.error("Error loading earth texture:", error);
        console.log("Using procedural earth texture fallback");
        setMapTexture(fallbackTexture);
        setTexturesLoaded(true);
      }
    );
    
    // Try to load bump map
    textureLoader.load(
      '/earth_bump.jpg',
      (texture) => {
        console.log("Earth bump map loaded successfully");
        setBumpTexture(texture);
        setTexturesLoaded(true);
      },
      undefined,
      (error) => {
        console.error("Error loading earth bump map:", error);
        console.log("Using procedural bump map fallback");
        setBumpTexture(fallbackBumpMap);
        setTexturesLoaded(true);
      }
    );
    
    return () => clearTimeout(timeoutId);
  }, []);

  return { mapTexture, bumpTexture, texturesLoaded };
};
