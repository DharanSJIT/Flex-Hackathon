import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import InsightBanner from '../components/InsightBanner';

const Home = () => {
  const { items, hazards, loading } = useOutletContext();

  const facilityData = useMemo(() => {
    if (!items.length) return [];
    const counts = items.reduce((acc, item) => {
      acc[item.facility] = (acc[item.facility] || 0) + item.quantity;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [items]);

  const stockData = useMemo(() => {
    if (!items.length) return [];
    const lowStock = items.filter(i => i.quantity < i.reorderThreshold).length;
    const healthy = items.length - lowStock;
    return [
      { name: 'Healthy Stock', value: healthy, color: '#10B981' }, // emerald-500
      { name: 'Low Stock', value: lowStock, color: '#EF4444' } // red-500
    ];
  }, [items]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading insights...</div>;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      
      {/* Hero Banner */}
      <div className="relative w-full h-80 bg-gray-900 overflow-hidden rounded-xl shadow-lg">
        <img 
          src="/src/assets/hero-ai.png" 
          alt="Smart Warehouse" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
          <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">Intelligent Inventory Assistant</h2>
          <p className="text-gray-200 text-lg max-w-2xl leading-relaxed">
            Real-time tracking, AI-powered insights, and instant hazard reporting for 100+ Flex facilities globally.
          </p>
        </div>
      </div>

      <InsightBanner items={items} hazards={hazards} />
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-flex-dark mb-6">Inventory by Facility</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facilityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#0099DE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-flex-dark mb-6">Global Stockout Risk</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockData}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {stockData.map(entry => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm font-medium text-gray-600">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
