import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Map as MapIcon, Zap, Route as RouteIcon, Target, Loader2, ArrowRight } from 'lucide-react';

const GRID_SIZE = 20;

const SmartFlow = () => {
  const { items, loading } = useOutletContext();
  const [activeOrder, setActiveOrder] = useState(null);
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

  // Mock Orders for the Sequence UI
  const [orders, setOrders] = useState([
    {
      id: 'ORD-48271',
      picker: 'Maria G.',
      status: 'Optimized',
      stops: []
    },
    {
      id: 'ORD-48272',
      picker: 'James T.',
      status: 'Optimized',
      stops: []
    },
    {
      id: 'ORD-48273',
      picker: 'Unassigned',
      status: 'Unoptimized',
      stops: []
    }
  ]);

  const generateRoute = () => {
    if (!items || items.length === 0) return;
    setIsRouting(true);
    setActiveOrder(null);

    setTimeout(() => {
      // Pick 4 random items to form an order
      const orderItems = [];
      const usedIndices = new Set();
      while(orderItems.length < 4) {
        const idx = Math.floor(Math.random() * items.length);
        if(!usedIndices.has(idx) && items[idx].location) {
          usedIndices.add(idx);
          orderItems.push(items[idx]);
        }
      }

      // TSP approximation
      let currentLoc = { x: 0, y: 0 }; 
      const unvisited = [...orderItems];
      const path = [];

      let stopCounter = 1;
      while(unvisited.length > 0) {
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
        path.push({
          stopNum: stopCounter++,
          zone: `A${Math.floor(Math.random() * 20) + 1}-L${Math.floor(Math.random() * 3) + 1}`, // Mock Zone
          item: nextItem
        });
        currentLoc = nextItem.location;
      }

      const newOrder = {
        id: `ORD-${Math.floor(Math.random() * 10000) + 50000}`,
        picker: 'System Simulation',
        status: 'Optimized',
        stops: path,
        gridPath: [{x:0,y:0}, ...path.map(p => p.item.location), {x:0,y:0}] // Include start/end
      };

      setActiveOrder(newOrder);
      
      // Update the orders list with the new simulation at the top
      setOrders(prev => [newOrder, prev[0], prev[1]]);
      setIsRouting(false);
    }, 1200);
  };

  const getHeatmapColor = (demand) => {
    if (demand > 80) return 'bg-red-500'; 
    if (demand > 60) return 'bg-orange-500';
    if (demand > 40) return 'bg-yellow-400';
    if (demand > 20) return 'bg-green-400';
    return 'bg-blue-400'; 
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading SmartFlow Engine...</div>;

  return (
    <div className="bg-flex-light min-h-screen text-gray-800 pb-12">
      <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pt-6">
        
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-flex-dark flex items-center gap-2">
              <RouteIcon className="w-6 h-6 text-flex-blue" />
              Dynamic Routing
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Optimized pick path visualization and demand-based slotting.
            </p>
          </div>
          <button 
            onClick={generateRoute}
            disabled={isRouting}
            className="bg-flex-blue text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50 shadow-sm"
          >
            {isRouting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            {isRouting ? 'Optimizing...' : 'Simulate New Route'}
          </button>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
              <Zap className="w-6 h-6 text-flex-blue" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-flex-dark">342m</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Avg Route Distance</div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center border border-green-100">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-flex-dark">7.3m</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Avg Pick Time</div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center border border-yellow-100">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-flex-dark">82%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Optimization Rate</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Sequence UI */}
          <div className="flex flex-col gap-6">
            <div className="mb-2">
              <h2 className="text-lg font-bold text-flex-dark">Route Stop Sequences</h2>
              <p className="text-sm text-gray-500">Detailed stop-by-stop breakdown</p>
            </div>

            <div className="space-y-6">
              {orders.map((order, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-extrabold text-gray-800">{order.id}</span>
                    <span className="text-gray-500 text-sm">— {order.picker}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${order.status === 'Optimized' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center flex-wrap gap-2">
                    {order.stops.length > 0 ? (
                      order.stops.map((stop, sIdx) => (
                        <React.Fragment key={sIdx}>
                          <div className="flex flex-col bg-gray-50 border border-gray-200 rounded-lg p-3 min-w-[120px] shadow-sm">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1 text-center">Stop {stop.stopNum}</span>
                            <span className="font-mono text-sm font-bold text-flex-dark text-center mb-1">{stop.zone}</span>
                            <span className="text-xs text-gray-500 font-medium text-center truncate max-w-[100px]" title={stop.item.name}>{stop.item.name}</span>
                          </div>
                          {sIdx < order.stops.length - 1 && (
                            <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0 mx-1" />
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400 italic">No stops available. (Simulation required)</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 2D Grid Visualizer (Light Mode) */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
             <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-gray-400" />
                Live Slotting Heatmap
              </h3>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" title="Fast Moving"></span>
                <span className="w-3 h-3 rounded-full bg-blue-400" title="Slow Moving"></span>
              </div>
            </div>

            <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-300 shadow-inner flex-1">
              {/* SVG Overlay for Paths */}
              {activeOrder && (
                <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                  <polyline
                    points={activeOrder.gridPath.map(p => `${(p.x / GRID_SIZE) * 100 + 2.5}% , ${(p.y / GRID_SIZE) * 100 + 2.5}%`).join(' ')}
                    fill="none"
                    stroke="#2563EB" // blue-600
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    className="animate-[dash_1s_linear_infinite]"
                  />
                  {/* Target nodes */}
                  {activeOrder.gridPath.map((p, i) => (
                    <circle key={i} cx={`${(p.x / GRID_SIZE) * 100 + 2.5}%`} cy={`${(p.y / GRID_SIZE) * 100 + 2.5}%`} r="5" fill={i === 0 || i === activeOrder.gridPath.length - 1 ? '#10B981' : '#2563EB'} stroke="#fff" strokeWidth="2" />
                  ))}
                </svg>
              )}

              {/* Render 20x20 Grid */}
              <div 
                className="absolute inset-0 grid gap-[1px] p-1 bg-gray-300"
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
                      className={`relative rounded-sm transition-colors duration-300 z-0 ${isDispatch ? 'bg-black' : item ? getHeatmapColor(item.demandScore) : 'bg-white'}`}
                      title={isDispatch ? 'Dispatch Zone' : item ? `${item.name}\nDemand: ${item.demandScore}` : 'Empty Slot'}
                    >
                      {isDispatch && <span className="absolute inset-0 flex items-center justify-center text-white text-[8px] font-bold">OUT</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes dash {
            to { stroke-dashoffset: -10; }
          }
        `}} />
      </div>
    </div>
  );
};

export default SmartFlow;
