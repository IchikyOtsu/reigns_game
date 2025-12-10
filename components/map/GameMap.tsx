'use client';

import { MapContainer, ImageOverlay, GeoJSON, Tooltip, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

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
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds);
    }
  }, [map, bounds]);
  
  return null;
};

interface GameMapProps {
  rows?: string[]; // ['A', 'B', ...]
  cols?: number[]; // [1, 2, ...]
  tileSize?: number; // e.g., 1024
  geoJsonUrl: string;
  tilesPath: string; // '/map/tiles/'
  totalWidth?: number;
  totalHeight?: number;
}

const GameMap = ({ 
  rows = ['A', 'B', 'C', 'D'], 
  cols = [1, 2, 3, 4], 
  tileSize = 1024, 
  geoJsonUrl, 
  tilesPath,
  totalWidth,
  totalHeight
}: GameMapProps) => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    fetch(geoJsonUrl)
      .then(res => res.json())
      .then(data => setGeoJsonData(data))
      .catch(err => console.error("Failed to load GeoJSON", err));
  }, [geoJsonUrl]);

  // Calculate map dimensions
  // Use provided dimensions or fallback to tiled dimensions
  const mapWidth = totalWidth || (cols.length * tileSize);
  const mapHeight = totalHeight || (rows.length * tileSize);
  
  // Calculate tile dimensions to fit the map exactly
  const tileWidth = totalWidth && cols.length ? totalWidth / cols.length : tileSize;
  const tileHeight = totalHeight && rows.length ? totalHeight / rows.length : tileSize;
  
  // Define bounds for the actual content [0,0] to [height, width]
  // We use a coordinate system where (0,0) is bottom-left of the image content
  const bounds: L.LatLngBoundsExpression = [[0, 0], [mapHeight, mapWidth]];
  
  // Center is middle of the content
  const center: L.LatLngExpression = [mapHeight / 2, mapWidth / 2];

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindTooltip(feature.properties.name, {
        permanent: false,
        direction: 'center',
        className: 'bg-transparent border-0 text-white font-bold shadow-none'
      });
    }
    
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.4
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        // Reset style (simplified)
        layer.setStyle({
          weight: 1,
          color: 'white',
          fillOpacity: 0.1
        });
      },
      click: (e) => {
        // Handle click
        console.log("Clicked feature:", feature);
      }
    });
  };

  return (
    <MapContainer
      center={center}
      zoom={-2}
      crs={L.CRS.Simple}
      style={{ height: '100%', width: '100%', background: '#0f172a' }}
      minZoom={-5}
      maxZoom={2}
      scrollWheelZoom={true}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
    >
      <MapController bounds={bounds} />
      
      {rows.map((row, rowIndex) => (
        cols.map((col, colIndex) => {
          // Calculate position for each tile
          // We align tiles from the top (mapHeight) downwards
          
          const y = mapHeight - (rowIndex + 1) * tileHeight;
          const x = colIndex * tileWidth;
          const imageBounds: L.LatLngBoundsExpression = [[y, x], [y + tileHeight, x + tileWidth]];
          
          return (
            <ImageOverlay
              key={`${row}${col}`}
              url={`${tilesPath}${row}${col}.png`}
              bounds={imageBounds}
            />
          );
        })
      ))}
      
      {geoJsonData && (
        <GeoJSON 
          data={geoJsonData} 
          style={{ 
            color: 'white', 
            weight: 1, 
            fillOpacity: 0.1,
            fillColor: '#3b82f6'
          }} 
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
};

export default GameMap;
