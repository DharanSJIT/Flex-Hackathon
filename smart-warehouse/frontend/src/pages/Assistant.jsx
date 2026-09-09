import React, { useState, useEffect } from 'react';
import ChatAssistant from '../components/ChatAssistant';
import { Activity, Server, Package, AlertTriangle, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const Assistant = () => {
  const [stats, setStats] = useState({ total: 0, critical: 0, facilities: 0 });

  useEffect(() => {
    // Fetch live context for the sidebar
    const fetchContext = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/inventory');
        const items = res.data;
        const total = items.length;
        const critical = items.filter(i => i.quantity < i.reorderThreshold).length;
        const facilities = new Set(items.map(i => i.facility)).size;
        setStats({ total, critical, facilities });
      } catch (err) {
        console.error("Failed to fetch context stats");
      }
    };
    fetchContext();
  }, []);

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-8rem)] min-h-[600px] flex flex-col pt-4">
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold text-flex-dark flex items-center gap-2">
          <Server className="w-6 h-6 text-flex-blue" />
          AI Command Center
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Interact with Gemini AI to analyze inventory, run forecasting models, or draft smart POs.
        </p>
      </div>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 h-full pb-6">
        
        {/* Main Chat Interface */}
        <div className="lg:col-span-3 h-full flex flex-col">
          <div className="flex-1 shadow-sm rounded-xl overflow-hidden border border-gray-200 bg-white flex flex-col">
            <ChatAssistant />
          </div>
        </div>

        {/* Live Context Sidebar */}
        <div className="hidden lg:flex flex-col gap-4 h-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
              <Activity className="w-4 h-4 text-green-500" />
              Live System Context
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Package className="w-4 h-4 text-flex-blue" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Total SKUs</span>
                </div>
                <span className="font-bold text-gray-900">{stats.total}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-red-700">Critical Stock</span>
                </div>
                <span className="font-bold text-red-700">{stats.critical}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Server className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Active Facilities</span>
                </div>
                <span className="font-bold text-gray-900">{stats.facilities}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-flex-dark rounded-xl shadow-sm border border-gray-800 p-5 flex-1 flex flex-col justify-end relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <ShieldCheck className="w-24 h-24 text-white" />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-green-400 font-mono text-xs uppercase tracking-widest font-bold">System Secure</span>
                </div>
                <p className="text-gray-400 text-xs">
                  AI endpoints are active. All queries are encrypted and processed in real-time by the FlexWare engine.
                </p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Assistant;
