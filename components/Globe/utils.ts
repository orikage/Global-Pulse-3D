import * as THREE from 'three';

export const latLonToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));

  return new THREE.Vector3(x, y, z);
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Politics': return '#ef4444'; // Red
    case 'Technology': return '#06b6d4'; // Cyan
    case 'Business': return '#eab308'; // Yellow
    case 'Science': return '#a855f7'; // Purple
    case 'Sports': return '#22c55e'; // Green
    case 'Entertainment': return '#ec4899'; // Pink
    default: return '#ffffff';
  }
};