import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ChatAssistant from './components/ChatAssistant';
import HazardReport from './components/HazardReport';
import SafetyFeed from './components/SafetyFeed';
import InsightBanner from './components/InsightBanner';

function App() {
  const [items, setItems] = useState([]);
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [itemsRes, hazardsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/items'),
        axios.get('http://localhost:5000/api/hazards')
      ]);
      setItems(itemsRes.data);
      setHazards(hazardsRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-flex-light">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-flex-blue text-white rounded flex items-center justify-center font-bold text-xl">
              F
            </div>
            <h1 className="text-xl font-bold text-flex-dark tracking-tight">Smart Warehouse</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-1 text-flex-blue">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Loading warehouse data...
          </div>
        ) : (
          <>
            <InsightBanner items={items} hazards={hazards} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column (Inventory) */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <Dashboard items={items} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <HazardReport onHazardReported={fetchData} />
                  <SafetyFeed hazards={hazards} />
                </div>
              </div>

              {/* Right Column (AI Assistant) */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <ChatAssistant />
                </div>
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
