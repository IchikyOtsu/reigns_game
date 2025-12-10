'use client';

import MapWrapper from "@/components/map/MapWrapper";
import { useState } from "react";

export default function MapPage() {
  // Configuration for the map
  // Map dimensions: 12288 x 5848 px
  // Tiles: Rows A-H, Cols 1-8
  // The map component will automatically stretch the tiles to fit the total dimensions
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']; 
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];
  
  const [flipY, setFlipY] = useState(false);
  const [showCells, setShowCells] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [fitWorld, setFitWorld] = useState(true);

  return (
    <div className="h-[calc(100vh-6rem)] w-full relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      <MapWrapper 
        rows={rows}
        cols={cols}
        geoJsonUrl="/map/savantia.geojson"
        tilesPath="/map/tiles/"
        totalWidth={12288}
        totalHeight={5848}
        flipY={flipY}
        showCells={showCells}
        showGrid={showGrid}
        fitWorld={fitWorld}
      />
      
      <div className="absolute top-4 right-4 z-[1000] bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700 text-white max-w-sm">
        <h3 className="font-bold mb-2">Map Controls</h3>
        <p className="text-sm text-slate-300 mb-4">
          Use mouse wheel to zoom. Click and drag to pan.
          Hover over regions to see details.
        </p>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showCells} 
              onChange={(e) => setShowCells(e.target.checked)}
              className="rounded border-slate-600 bg-slate-700 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm">Enable Interaction</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showGrid} 
              onChange={(e) => setShowGrid(e.target.checked)}
              className="rounded border-slate-600 bg-slate-700 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm">Show Grid Lines</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={fitWorld} 
              onChange={(e) => setFitWorld(e.target.checked)}
              className="rounded border-slate-600 bg-slate-700 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm">Align to World (Fix Shift)</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={flipY} 
              onChange={(e) => setFlipY(e.target.checked)}
              className="rounded border-slate-600 bg-slate-700 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm">Flip Y-Axis</span>
          </label>
        </div>
      </div>
    </div>
  );
}
