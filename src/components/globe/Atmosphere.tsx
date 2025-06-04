
import * as THREE from 'three';

const Atmosphere = () => {
  return (
    <mesh>
      <sphereGeometry args={[1.02, 32, 32]} />
      <meshBasicMaterial 
        color="#4299E1" 
        transparent={true} 
        opacity={0.1} 
      />
    </mesh>
  );
};

export default Atmosphere;
