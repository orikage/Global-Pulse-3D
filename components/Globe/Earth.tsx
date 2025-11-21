import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Sphere } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';

// Add global declaration to extend JSX.IntrinsicElements with used Three elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshPhongMaterial: any;
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
    }
  }
}

interface EarthProps {
  radius: number;
}

const Earth: React.FC<EarthProps> = ({ radius }) => {
  
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    // Using high-res maps from a reliable CDN for space assets or similar placeholders
    const map = loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
    const bumpMap = loader.load('https://unpkg.com/three-globe/example/img/earth-topology.png');
    return { map, bumpMap };
  }, []);

  return (
    <Sphere args={[radius, 64, 64]}>
      <meshPhongMaterial
        map={texture.map}
        bumpMap={texture.bumpMap}
        bumpScale={0.05}
        specularMap={texture.map} // Approximating specular with map for simpler water reflection
        specular={new THREE.Color('grey')}
        shininess={10}
      />
      
      {/* Atmosphere Glow Effect */}
      <mesh scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial
          color="#4facfe"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Sphere>
  );
};

export default Earth;