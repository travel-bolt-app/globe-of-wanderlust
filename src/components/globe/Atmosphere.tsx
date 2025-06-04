import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const FresnelMaterial = shaderMaterial(
  {
    c: 0.7,
    p: 4.0,
    glowColor: new THREE.Color(0.8, 0.9, 1.0), // Light blue/white
  },
  // Vertex Shader
  `
    varying float vIntensity;
    uniform float c;
    uniform float p;

    void main() {
      vec3 vNormal = normalize(normalMatrix * normal);
      vec3 vViewPosition = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
      vIntensity = pow(c - dot(vNormal, vViewPosition), p);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying float vIntensity;
    uniform vec3 glowColor;

    void main() {
      gl_FragColor = vec4(glowColor, vIntensity * 0.7);
    }
  `
);

extend({ FresnelMaterial });

const Atmosphere = () => {
  return (
    <mesh>
      <sphereGeometry args={[1.03, 32, 32]} />
      {/* @ts-ignore */}
      <fresnelMaterial
        transparent={true} 
        side={THREE.BackSide}
      />
    </mesh>
  );
};

export default Atmosphere;
