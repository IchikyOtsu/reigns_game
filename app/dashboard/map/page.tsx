import MapWrapper from "@/components/map/MapWrapper";

export default function MapPage() {
  // Configuration for the map
  // Map dimensions: 12288 x 5848 px
  // Tiles: Rows A-H, Cols 1-7
  // The map component will automatically stretch the tiles to fit the total dimensions
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']; 
  const cols = [1, 2, 3, 4, 5, 6, 7];
  
  return (
    <div className="h-[calc(100vh-6rem)] w-full relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      <MapWrapper 
        rows={rows}
        cols={cols}
        geoJsonUrl="/map/savantia.geojson"
        tilesPath="/map/tiles/"
        totalWidth={12288}
        totalHeight={5848}
      />
      
      <div className="absolute top-4 right-4 z-[1000] bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700 text-white max-w-sm">
        <h3 className="font-bold mb-2">Map Controls</h3>
        <p className="text-sm text-slate-300">
          Use mouse wheel to zoom. Click and drag to pan.
          Hover over regions to see details.
        </p>
      </div>
    </div>
  );
}
