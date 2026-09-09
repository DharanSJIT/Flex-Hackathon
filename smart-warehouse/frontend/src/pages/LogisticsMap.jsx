import React, { useState, useEffect } from 'react';
import { Network, AlertCircle, CloudLightning, ShieldCheck, TrendingUp, Package, ArrowRight } from 'lucide-react';

const LogisticsMap = () => {
  const [nodes, setNodes] = useState({
    west: { id: 'west', name: 'West Coast Facility', x: 20, y: 50, capacity: 85, status: 'Optimal', stock: 12500 },
    central: { id: 'central', name: 'Central Hub', x: 50, y: 60, capacity: 60, status: 'Optimal', stock: 28000 },
    east: { id: 'east', name: 'East Coast Facility', x: 80, y: 40, capacity: 75, status: 'Optimal', stock: 14200 }
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [eventLog, setEventLog] = useState([
    { time: new Date().toLocaleTimeString(), msg: 'System online. All facilities operating at optimal capacity.' }
  ]);
  const [transferPath, setTransferPath] = useState(null); // { from, to }

  const triggerShock = () => {
    setIsSimulating(true);
    
    // 1. Initial Shock
    setEventLog(prev => [{ time: new Date().toLocaleTimeString(), msg: '🚨 WARNING: Severe weather system detected on East Coast. Unprecedented demand spike predicted.' }, ...prev]);
    
    setNodes(prev => ({
      ...prev,
      east: { ...prev.east, status: 'Critical', capacity: 98, stock: 1200 }
    }));

    // 2. AI Rerouting (after 2 seconds)
    setTimeout(() => {
      setEventLog(prev => [{ time: new Date().toLocaleTimeString(), msg: '⚡ AI Engine activated. Re-routing 5,000 units from Central Hub to East Coast.' }, ...prev]);
      setTransferPath({ from: 'central', to: 'east' });
    }, 2000);

    // 3. Stabilization (after 5 seconds)
    setTimeout(() => {
      setEventLog(prev => [{ time: new Date().toLocaleTimeString(), msg: '✅ Transfer complete. East Coast stock stabilized. Regional shortage prevented.' }, ...prev]);
      setNodes(prev => ({
        ...prev,
        east: { ...prev.east, status: 'Optimal', capacity: 80, stock: 6200 },
        central: { ...prev.central, capacity: 75, stock: 23000 }
      }));
      setTransferPath(null);
      setIsSimulating(false);
    }, 6000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Optimal': return 'text-green-600 bg-green-50 border-green-200';
      case 'Warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200 animate-pulse';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Optimal': return 'bg-green-500';
      case 'Warning': return 'bg-yellow-500';
      case 'Critical': return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-ping';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-flex-light min-h-[85vh] text-gray-800 pb-12 flex flex-col">
      <div className="max-w-7xl mx-auto animate-in fade-in duration-500 w-full pt-6 flex-1 flex flex-col">
        
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-flex-dark flex items-center gap-2">
              <Network className="w-6 h-6 text-flex-blue" />
              Global Logistics Map
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Real-time multi-facility stock balancing and supply chain resilience.
            </p>
          </div>
          <button 
            onClick={triggerShock}
            disabled={isSimulating}
            className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-red-700 transition-all disabled:opacity-50 shadow-md hover:shadow-lg active:scale-95"
          >
            <CloudLightning className={`w-5 h-5 ${isSimulating ? 'animate-pulse' : ''}`} />
            {isSimulating ? 'Processing Crisis...' : 'Simulate Demand Shock'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          
          {/* Map Area */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative min-h-[500px]">
            {/* SVG Network Background */}
            <div className="absolute inset-0 bg-[#f8fafc]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none">
              {/* Connecting Lines */}
              <line x1="20%" y1="50%" x2="50%" y2="60%" stroke="#e2e8f0" strokeWidth="4" strokeDasharray="10 10" />
              <line x1="50%" y1="60%" x2="80%" y2="40%" stroke="#e2e8f0" strokeWidth="4" strokeDasharray="10 10" />
              
              {/* Animated Transfer Path */}
              {transferPath && (
                <>
                  <path 
                    id="transferPath"
                    d={`M ${nodes[transferPath.from].x} ${nodes[transferPath.from].y} L ${nodes[transferPath.to].x} ${nodes[transferPath.to].y}`} 
                    fill="none" 
                    stroke="#0099DE" 
                    strokeWidth="4" 
                    strokeDasharray="12 12"
                    className="animate-[dash_1s_linear_infinite]"
                  />
                  <circle r="8" fill="#0099DE" className="shadow-[0_0_15px_rgba(0,153,222,0.8)]">
                    <animateMotion dur="2s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                      <mpath href="#transferPath" />
                    </animateMotion>
                  </circle>
                </>
              )}
            </svg>

            {/* Nodes */}
            {Object.values(nodes).map(node => (
              <div 
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 shadow-lg transition-colors ${getStatusDot(node.status)}`}>
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                
                <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-200 min-w-[160px] text-center transform transition-transform group-hover:scale-105">
                  <h3 className="font-extrabold text-sm text-gray-800">{node.name}</h3>
                  <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded border inline-block ${getStatusColor(node.status)}`}>
                    {node.status}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-left">
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Capacity</div>
                      <div className="text-sm font-extrabold text-gray-700">{node.capacity}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Stock</div>
                      <div className="text-sm font-extrabold text-gray-700">{node.stock.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Logs & Stats Sidebar */}
          <div className="flex flex-col gap-6">
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
               <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                 <ShieldCheck className="w-5 h-5 text-green-500" />
                 Network Health
               </h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Total Network Stock</span>
                    <span className="font-bold text-gray-900 text-lg">
                      {Object.values(nodes).reduce((acc, curr) => acc + curr.stock, 0).toLocaleString()}
                    </span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="text-sm font-medium text-flex-blue">AI Routing Efficiency</span>
                    <span className="font-bold text-flex-blue text-lg flex items-center gap-1">
                      94.2% <TrendingUp className="w-4 h-4" />
                    </span>
                 </div>
               </div>
             </div>

             <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col max-h-[400px]">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4 shrink-0">
                 <AlertCircle className="w-5 h-5 text-gray-400" />
                 AI Event Log
               </h3>
               <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                 {eventLog.map((log, idx) => (
                   <div key={idx} className={`p-3 rounded-lg text-sm border shadow-sm animate-in slide-in-from-right-2 ${
                     log.msg.includes('WARNING') ? 'bg-red-50 border-red-200 text-red-800' : 
                     log.msg.includes('AI Engine') ? 'bg-blue-50 border-blue-200 text-flex-blue' :
                     'bg-gray-50 border-gray-200 text-gray-600'
                   }`}>
                     <div className="text-[10px] uppercase font-bold opacity-70 mb-1">{log.time}</div>
                     <div className="font-medium">{log.msg}</div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes dash {
            to { stroke-dashoffset: -24; }
          }
        `}} />
      </div>
    </div>
  );
};

export default LogisticsMap;
