'use client';

import { MapContainer, ImageOverlay, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useMemo } from 'react';

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
  flipY?: boolean; // Option to flip Y coordinates of GeoJSON
  showCells?: boolean;
  showGrid?: boolean;
  fitWorld?: boolean;
}

const createAutoFitCRS = (
  minX: number, 
  maxX: number, 
  minY: number, 
  maxY: number, 
  imageWidth: number, 
  imageHeight: number,
  fitWorld: boolean = false
) => {
  if (fitWorld) {
    // Assume Equirectangular projection of the full world width (-180 to 180)
    // centered at (0,0)
    const scale = imageWidth / 360;
    const offsetX = imageWidth / 2;
    const offsetY = imageHeight / 2;
    
    return L.extend({}, L.CRS.Simple, {
      transformation: new L.Transformation(scale, offsetX, -scale, offsetY),
    });
  }

  // Calculate dimensions
  const geoWidth = maxX - minX;
  const geoHeight = maxY - minY;

  // Calculate scales for both dimensions
  const scaleX = imageWidth / geoWidth;
  const scaleY = imageHeight / geoHeight;

  // Use uniform scale to preserve aspect ratio (fit inside)
  const scale = Math.min(scaleX, scaleY);

  // Calculate margins to center the content
  const marginX = (imageWidth - (geoWidth * scale)) / 2;
  const marginY = (imageHeight - (geoHeight * scale)) / 2;

  // Calculate offsets
  // pixelX = scale * geoX + offsetX
  // marginX = scale * minX + offsetX => offsetX = marginX - scale * minX
  const offsetX = marginX - (scale * minX);

  // pixelY = -scale * geoY + offsetY
  // marginY = -scale * maxY + offsetY => offsetY = marginY + scale * maxY
  // Note: Y is inverted, so maxY is at the top (lowest pixel Y value, i.e. marginY)
  const offsetY = marginY + (scale * maxY);

  // Return configured CRS
  return L.extend({}, L.CRS.Simple, {
    transformation: new L.Transformation(scale, offsetX, -scale, offsetY),
  });
};

const GameMap = ({ 
  rows = ['A', 'B', 'C', 'D'], 
  cols = [1, 2, 3, 4], 
  tileSize = 1024, 
  geoJsonUrl, 
  tilesPath,
  totalWidth,
  totalHeight,
  flipY = false,
  showCells = true,
  showGrid = false,
  fitWorld = false
}: GameMapProps) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [mapCRS, setMapCRS] = useState<L.CRS | null>(null);

  // Calculate map dimensions
  const mapWidth = totalWidth || (cols.length * tileSize);
  const mapHeight = totalHeight || (rows.length * tileSize);
  
  // Calculate tile dimensions
  const tileWidth = totalWidth && cols.length ? totalWidth / cols.length : tileSize;
  const tileHeight = totalHeight && rows.length ? totalHeight / rows.length : tileSize;

  useEffect(() => {
    console.log("Fetching GeoJSON from:", geoJsonUrl);
    fetch(geoJsonUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
      })
      .then(text => {
        try {
          const data = JSON.parse(text);
          
          // Parcourt récursivement tout le GeoJSON pour trouver les bornes (minX, maxX, minY, maxY)
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          
          const updateBounds = (coords: any[]) => {
            if (Array.isArray(coords[0])) {
              coords.forEach(updateBounds);
            } else if (coords.length >= 2) {
              const x = coords[0];
              const y = coords[1];
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          };

          data.features.forEach((f: any) => {
            if (f.geometry && f.geometry.coordinates) {
              updateBounds(f.geometry.coordinates);
            }
          });
          
          console.log("GeoJSON Bounds:", { minX, minY, maxX, maxY });
          
          // Create AutoFit CRS
          const crs = createAutoFitCRS(minX, maxX, minY, maxY, mapWidth, mapHeight, fitWorld);
          setMapCRS(crs);
          setGeoJsonData(data); // Use raw data
          
        } catch (e) {
          console.error("Failed to parse GeoJSON:", e);
        }
      })
      .catch(err => console.error("Failed to load GeoJSON", err));
  }, [geoJsonUrl, mapWidth, mapHeight]);
  
  if (!mapCRS || !geoJsonData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-pulse">Loading Map Data...</div>
      </div>
    );
  }

  return <GameMapContent 
    rows={rows} 
    cols={cols} 
    tileSize={tileSize} 
    tilesPath={tilesPath} 
    mapWidth={mapWidth} 
    mapHeight={mapHeight} 
    tileWidth={tileWidth} 
    tileHeight={tileHeight} 
    geoJsonData={geoJsonData} 
    crs={mapCRS} 
    showCells={showCells}
    showGrid={showGrid}
  />;
};

// Inner component to handle the map rendering with valid data
const GameMapContent = ({ 
  rows, cols, tileSize, tilesPath, mapWidth, mapHeight, tileWidth, tileHeight, geoJsonData, crs, showCells, showGrid 
}: any) => {
  
  // Calculate bounds in LatLng (GeoJSON coords)
  // Top-Left pixel (0,0) -> LatLng
  const p1 = crs.pointToLatLng(L.point(0, 0), 0); 
  // Bottom-Right pixel (mapWidth, mapHeight) -> LatLng
  const p2 = crs.pointToLatLng(L.point(mapWidth, mapHeight), 0); 
  
  const bounds = L.latLngBounds(p1, p2);
  const center = bounds.getCenter();

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
          fillOpacity: 0.4,
          opacity: 1
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 1,
          color: 'white',
          fillOpacity: 0,
          opacity: showGrid ? 0.5 : 0
        });
      },
      click: (e) => {
        console.log("Clicked feature:", feature);
      }
    });
  };

  return (
    <MapContainer
      center={center}
      zoom={0} 
      crs={crs}
      style={{ height: '100%', width: '100%', background: '#0f172a' }}
      minZoom={-5}
      maxZoom={5}
      scrollWheelZoom={true}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
    >
      <MapController bounds={bounds} />
      
      {rows.map((row: string, rowIndex: number) => (
        cols.map((col: number, colIndex: number) => {
          // Calculate position for each tile
          // We assume Row A is at the top (y=0)
          const y = rowIndex * tileHeight;
          const x = colIndex * tileWidth;
          
          // Convert pixel bounds to LatLng bounds for ImageOverlay
          const southWest = crs.pointToLatLng(L.point(x, y + tileHeight), 0);
          const northEast = crs.pointToLatLng(L.point(x + tileWidth, y), 0);
          const imageBounds = L.latLngBounds(southWest, northEast);
          
          return (
            <ImageOverlay
              key={`${row}${col}`}
              url={`${tilesPath}${row}${col}.png`}
              bounds={imageBounds}
            />
          );
        })
      ))}
      
      {showCells && (
        <GeoJSON 
          key={`${showGrid}`} // Force re-render when showGrid changes
          data={geoJsonData} 
          style={{ 
            color: 'white', 
            weight: 1, 
            fillOpacity: 0,
            opacity: showGrid ? 0.5 : 0 
          }} 
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
};

export default GameMap;
