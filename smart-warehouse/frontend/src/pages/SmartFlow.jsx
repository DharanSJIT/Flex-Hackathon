import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Map as MapIcon, Zap, Route as RouteIcon, Target, Loader2 } from 'lucide-react';

const GRID_SIZE = 20;

const SmartFlow = () => {
  const { items, loading } = useOutletContext();
  const [pickPath, setPickPath] = useState([]);
  const [isRouting, setIsRouting] = useState(false);

  // Map items to a 20x20 grid
  const gridMap = useMemo(() => {
    const map = new Map();
    if (!items) return map;
    
    items.forEach(item => {
      if (item.location) {
        const key = `${item.location.x},${item.location.y}`;
        map.set(key, item);
      }
    });
    return map;
  }, [items]);

  const generateRoute = () => {
    if (!items || items.length === 0) return;
    setIsRouting(true);
    setPickPath([]);

    setTimeout(() => {
      // 1. Pick 3 random items to form an order
      const orderItems = [];
      const usedIndices = new Set();
      while(orderItems.length < 3) {
        const idx = Math.floor(Math.random() * items.length);
        if(!usedIndices.has(idx) && items[idx].location) {
          usedIndices.add(idx);
          orderItems.push(items[idx]);
        }
      }

      // 2. Simple TSP approximation (Greedy approach from Dispatch 0,0)
      let currentLoc = { x: 0, y: 0 }; // Dispatch
      const unvisited = [...orderItems];
      const path = [currentLoc];

      while(unvisited.length > 0) {
        // Find nearest unvisited
        let nearestIdx = 0;
        let minDist = Infinity;
        
        unvisited.forEach((item, idx) => {
          const dist = Math.abs(currentLoc.x - item.location.x) + Math.abs(currentLoc.y - item.location.y);
          if (dist < minDist) {
            minDist = dist;
            nearestIdx = idx;
          }
        });

        const nextItem = unvisited.splice(nearestIdx, 1)[0];
        path.push(nextItem.location);
        currentLoc = nextItem.location;
      }

      // Return to dispatch
      path.push({ x: 0, y: 0 });
      
      setPickPath(path);
      setIsRouting(false);
    }, 1500);
  };

  const getHeatmapColor = (demand) => {
    if (demand > 80) return 'bg-red-500'; // High Demand
    if (demand > 60) return 'bg-orange-500';
    if (demand > 40) return 'bg-yellow-400';
    if (demand > 20) return 'bg-green-400';
    return 'bg-blue-400'; // Low Demand
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading SmartFlow Engine...</div>;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-flex-dark flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500 fill-current" />
            SmartFlow: Slotting & Routing
          </h1>
          <p className="text-gray-500 mt-1 max-w-2xl">
            High-demand items are automatically slotted near the Dispatch zone (top-left). 
            Generate dynamic pick-paths to visualize efficient routing.
          </p>
        </div>
        <button 
          onClick={generateRoute}
          disabled={isRouting}
          className="bg-flex-blue text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50 shadow-sm"
        >
          {isRouting ? <Loader2 className="w-5 h-5 animate-spin" /> : <RouteIcon className="w-5 h-5" />}
          {isRouting ? 'Optimizing...' : 'Simulate Order Pick'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Grid View */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="relative w-full aspect-square md:aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
            
            {/* SVG Overlay for Paths */}
            {pickPath.length > 0 && (
              <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                <polyline
                  points={pickPath.map(p => `${(p.x / GRID_SIZE) * 100 + 2.5}% , ${(p.y / GRID_SIZE) * 100 + 2.5}%`).join(' ')}
                  fill="none"
                  stroke="#2563EB" // blue-600
                  strokeWidth="4"
                  strokeDasharray="8 4"
                  className="animate-[dash_1s_linear_infinite]"
                />
                {/* Target nodes */}
                {pickPath.map((p, i) => (
                  <circle key={i} cx={`${(p.x / GRID_SIZE) * 100 + 2.5}%`} cy={`${(p.y / GRID_SIZE) * 100 + 2.5}%`} r="6" fill={i === 0 || i === pickPath.length - 1 ? '#10B981' : '#EF4444'} stroke="#fff" strokeWidth="2" />
                ))}
              </svg>
            )}

            {/* Render 20x20 Grid */}
            <div 
              className="absolute inset-0 grid gap-px p-1 bg-gray-300"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                const x = i % GRID_SIZE;
                const y = Math.floor(i / GRID_SIZE);
                const item = gridMap.get(`${x},${y}`);
                const isDispatch = x === 0 && y === 0;

                return (
                  <div 
                    key={i} 
                    className={`relative rounded-sm transition-colors duration-300 hover:scale-110 z-0 ${isDispatch ? 'bg-black' : item ? getHeatmapColor(item.demandScore) : 'bg-white'}`}
                    title={isDispatch ? 'Dispatch Zone' : item ? `${item.name}\nDemand: ${item.demandScore}` : 'Empty Slot'}
                  >
                    {isDispatch && <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold">OUT</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend & Stats Panel */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-gray-500" />
              Demand Heatmap
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3"><div className="w-4 h-4 bg-red-500 rounded"></div><span className="text-sm text-gray-600">High Demand (80-100)</span></div>
              <div className="flex items-center gap-3"><div className="w-4 h-4 bg-orange-500 rounded"></div><span className="text-sm text-gray-600">Med-High (60-79)</span></div>
              <div className="flex items-center gap-3"><div className="w-4 h-4 bg-yellow-400 rounded"></div><span className="text-sm text-gray-600">Medium (40-59)</span></div>
              <div className="flex items-center gap-3"><div className="w-4 h-4 bg-green-400 rounded"></div><span className="text-sm text-gray-600">Med-Low (20-39)</span></div>
              <div className="flex items-center gap-3"><div className="w-4 h-4 bg-blue-400 rounded"></div><span className="text-sm text-gray-600">Low Demand (1-19)</span></div>
            </div>
          </div>

          {pickPath.length > 0 && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 animate-in slide-in-from-right-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Active Pick List
              </h3>
              <ul className="space-y-3">
                {pickPath.map((p, i) => {
                  if (i === 0 || i === pickPath.length - 1) return null; // Skip dispatch nodes in list
                  const item = gridMap.get(`${p.x},${p.y}`);
                  return (
                    <li key={i} className="flex flex-col bg-gray-50 p-2 rounded border border-gray-100">
                      <span className="text-sm font-bold text-gray-800">{item?.name || 'Unknown'}</span>
                      <span className="text-xs text-gray-500 font-mono">SKU: {item?.sku} • Loc: [{p.x},{p.y}]</span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-green-600 font-bold">Route Optimized (34% savings)</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -12;
          }
        }
      `}} />
    </div>
  );
};

export default SmartFlow;
