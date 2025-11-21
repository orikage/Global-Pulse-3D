import React, { Suspense, useRef } from 'react';
import { Canvas, ThreeElements, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Preload } from '@react-three/drei';
import Earth from './Earth';
import NewsMarker from './NewsMarker';
import { NewsItem } from '../../types';

// Add global declaration to extend JSX.IntrinsicElements with used Three elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      group: any;
    }
  }
}

interface SceneProps {
  newsItems: NewsItem[];
  onNewsSelect: (news: NewsItem) => void;
  selectedNewsId: string | null;
}

const EARTH_RADIUS = 5;

// Component to handle the rotation logic
const RotationController: React.FC<{ controlsRef: React.RefObject<any>; selectedNewsId: string | null }> = ({ controlsRef, selectedNewsId }) => {
  useFrame((state) => {
    if (!controlsRef.current || selectedNewsId) return;

    const time = state.clock.getElapsedTime();
    let speed = 0.8; // Target speed

    // Initial rapid spin logic
    if (time < 3.0) {
      // Fast spin phase
      speed = 20.0;
    } else {
      // Deceleration phase: Smoothly transition from 20 to 0.8
      // Using exponential decay for smooth landing
      const decay = Math.exp(-(time - 3.0) * 1.5);
      speed = 0.8 + (20.0 - 0.8) * decay;
    }

    if (controlsRef.current.autoRotate) {
      controlsRef.current.autoRotateSpeed = speed;
    }
  });

  return null;
};

const Scene: React.FC<SceneProps> = ({ newsItems, onNewsSelect, selectedNewsId }) => {
  const controlsRef = useRef<any>(null);

  const handleSelect = (news: NewsItem) => {
    onNewsSelect(news);
    // Auto rotate stops automatically when interacting, but we ensure it here if needed
  };

  return (
    <div className="w-full h-full absolute inset-0 bg-space">
      <Canvas camera={{ position: [0, 0, 14], fov: 45 }}>
        <ambientLight intensity={0.6} color="#ccccff" />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4facfe" />
        
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Suspense fallback={null}>
            <group rotation={[0, 0, 0.2]}> {/* Tilt the earth slightly */}
                <Earth radius={EARTH_RADIUS} />
                {newsItems.map((item) => (
                    <NewsMarker
                        key={item.id}
                        news={item}
                        radius={EARTH_RADIUS}
                        onSelect={handleSelect}
                        isSelected={selectedNewsId === item.id}
                    />
                ))}
            </group>
        </Suspense>

        <OrbitControls 
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            minDistance={7}
            maxDistance={20}
            autoRotate={!selectedNewsId}
            autoRotateSpeed={20} // Initial speed set here, but overridden by Controller
            rotateSpeed={0.5}
            dampingFactor={0.1}
        />
        
        <RotationController controlsRef={controlsRef} selectedNewsId={selectedNewsId} />
        
        <Preload all />
      </Canvas>
    </div>
  );
};

export default Scene;