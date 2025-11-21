import React, { useMemo, useState, useRef } from 'react';
import { Html, Line } from '@react-three/drei';
import { ThreeElements, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NewsItem } from '../../types';
import { latLonToVector3, getCategoryColor } from './utils';

// Add global declaration to extend JSX.IntrinsicElements with used Three elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
    }
  }
}

interface NewsMarkerProps {
  news: NewsItem;
  radius: number;
  onSelect: (news: NewsItem) => void;
  isSelected: boolean;
}

const NewsMarker: React.FC<NewsMarkerProps> = ({ news, radius, onSelect, isSelected }) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  
  // Base Surface Position
  const startPos = useMemo(() => 
    latLonToVector3(news.coordinates.lat, news.coordinates.lon, radius),
    [news.coordinates, radius]
  );

  // Calculate "Elbow" geometry
  // We want a line that goes UP from surface, then bends Horizontally.
  const { elbowPos, endPos } = useMemo(() => {
    // Normal vector (straight up from surface)
    const normal = startPos.clone().normalize();
    
    // 1. Go UP to altitude
    // Increase base altitude to avoid clipping with the globe surface
    const altitudeBase = 1.5 + (Math.random() * 0.3); 
    const upVec = normal.clone().multiplyScalar(altitudeBase * radius - radius);
    const p1 = startPos.clone().add(upVec); // The "Knee" or "Elbow" point

    // 2. Go SIDEWAYS (Tangent)
    // Calculate a tangent vector. Cross product with Y axis usually works, unless at poles.
    let tangent = new THREE.Vector3(0, 1, 0).cross(normal).normalize();
    if (tangent.lengthSq() < 0.1) { // If we are at the pole
        tangent = new THREE.Vector3(1, 0, 0).cross(normal).normalize();
    }
    
    // Extend tangent for the "Arm"
    const armLength = 0.3 + (Math.random() * 0.2); // Shorter arm
    const p2 = p1.clone().add(tangent.multiplyScalar(armLength));

    return { elbowPos: p1, endPos: p2 };
  }, [startPos, radius]);

  const color = getCategoryColor(news.category);
  
  // Line Points: Start -> Elbow -> End
  const points = useMemo(() => [startPos, elbowPos, endPos], [startPos, elbowPos, endPos]);

  return (
    <group ref={groupRef}>
      {/* 1. The Surface Dot */}
      <mesh position={startPos}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh position={startPos}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} toneMapped={false} />
      </mesh>

      {/* 2. The Connector Line */}
      <Line
        points={points}       
        color={color}
        lineWidth={1}       
        transparent
        opacity={0.5}
      />

      {/* 3. The HTML Card at the end of the line */}
      <Html
        position={[endPos.x, endPos.y, endPos.z]}
        zIndexRange={[100, 0]}
        center // Center the HTML div on the point
        transform // Apply 3D transforms
        occlude="blending" // Hide when behind earth
        sprite
        distanceFactor={10} // Adjusted distance factor
        style={{
            pointerEvents: 'none', // Let the inner div handle events
        }}
      >
        <div
          className={`
            relative flex items-center pointer-events-auto cursor-pointer select-none
            transition-all duration-300 origin-left
            ${isSelected ? 'scale-110 z-50' : 'scale-100 hover:scale-110'}
          `}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(news);
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            transform: 'translateX(5px)', // Reduced offset
          }}
        >
          {/* The Connector Dot on the Card side */}
          <div className="w-1 h-1 rounded-full absolute -left-1 top-1/2 -translate-y-1/2 shadow-[0_0_5px_currentColor]" style={{ backgroundColor: color }} />

          {/* Card Content - Significantly reduced size */}
          <div 
            className="px-2 py-1 ml-1 border-l border-white/20 backdrop-blur-md bg-black/80 shadow-[0_0_10px_rgba(0,0,0,0.5)] w-[120px]"
            style={{
                borderLeftColor: color,
                borderTop: `1px solid ${color}33`,
                borderBottom: `1px solid ${color}33`,
                borderRight: `1px solid ${color}33`,
                background: `linear-gradient(90deg, ${color}11 0%, rgba(0,0,0,0.9) 100%)`
            }}
          >
            <div className="flex justify-between items-baseline pb-0.5 mb-0.5 border-b border-white/5">
                <span className="text-[7px] font-bold uppercase tracking-wider truncate max-w-[60px]" style={{ color: color }}>
                    {news.category}
                </span>
                <span className="text-[6px] text-gray-500">
                    {new Date(news.timestamp || '').getHours()}:00
                </span>
            </div>
            <h3 className="text-[8px] font-bold text-white leading-tight line-clamp-2 drop-shadow-sm mb-0.5">
                {news.title}
            </h3>
            {/* Hover Reveal Summary */}
            {(hovered || isSelected) && (
                <div className="mt-0.5 text-[7px] text-gray-300 leading-tight line-clamp-3 border-t border-white/5 pt-0.5">
                    {news.summary}
                </div>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
};

export default NewsMarker;