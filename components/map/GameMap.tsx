'use client';

import { MapContainer, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle initial view fitting
const MapController = ({ bounds }: { bounds: L.LatLngBoundsExpression }) => {
  const map = useMap();
  const isMounted = useRef(false);
  
  useEffect(() => {
    if (bounds && !isMounted.current) {
      map.fitBounds(bounds);
      isMounted.current = true;
    }
  }, [map, bounds]);
  
  return null;
};

interface GameMapProps {
  imageUrl: string;
  totalWidth: number;
  totalHeight: number;
}

const GameMap = ({ 
  imageUrl,
  totalWidth,
  totalHeight,
}: GameMapProps) => {

  // Use Simple CRS for flat images
  // In L.CRS.Simple, coordinates are (y, x) where y increases upwards.
  // We map the image to [[0,0], [totalHeight, totalWidth]]
  // So (0,0) is Bottom-Left, (totalHeight, totalWidth) is Top-Right.
  
  const bounds = new L.LatLngBounds([0, 0], [totalHeight, totalWidth]);
  const center = bounds.getCenter();

  return (
    <MapContainer
      center={center}
      zoom={0} 
      crs={L.CRS.Simple}
      style={{ height: '100%', width: '100%', background: '#0f172a' }}
      minZoom={-4}
      maxZoom={2}
      scrollWheelZoom={true}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
    >
      <MapController bounds={bounds} />
      
      <ImageOverlay
        url={imageUrl}
        bounds={bounds}
      />
    </MapContainer>
  );
};

export default GameMap;
