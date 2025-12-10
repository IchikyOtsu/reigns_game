'use client';

import MapWrapper from "@/components/map/MapWrapper";

export default function MapPage() {
  // Configuration for the map
  // Map dimensions: 7680 x 3655 px (political.png)
  
  return (
    <div className="h-[calc(100vh-6rem)] w-full relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      <MapWrapper 
        imageUrl="/map/political.png"
        totalWidth={7680}
        totalHeight={3655}
      />
      
      <div className="absolute top-4 right-4 z-[1000] bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700 text-white max-w-sm">
        <h3 className="font-bold mb-2">Map Controls</h3>
        <p className="text-sm text-slate-300 mb-0">
          Use mouse wheel to zoom. Click and drag to pan.
        </p>
      </div>
    </div>
  );
}
