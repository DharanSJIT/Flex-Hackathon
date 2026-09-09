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
      
      {/* Cinematic Hero Video Banner */}
      <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
        <video 
          src="/hero-video.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Hero Text Content (Moved Below Video) */}
      <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start -mt-4 relative z-10">
        <div className="inline-block px-3 py-1 bg-flex-blue text-white text-xs font-bold tracking-wider rounded-full mb-4 shadow-sm">
          FLEX ON-CAMPUS HACKATHON
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-flex-dark mb-4 tracking-tight leading-tight">
          Intelligent Inventory Assistant
        </h2>
        <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-4xl">
          Real-time tracking, AI-powered insights, and dynamic routing for 100+ Flex facilities globally. 
          The future of autonomous supply chains is here.
        </p>
      </div>

      <InsightBanner items={items} hazards={hazards} />
      
      {/* Premium Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        {/* Interactive Bar Chart Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col group">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-flex-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Inventory by Facility</h3>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facilityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#0099DE" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive Pie Chart Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col group">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Global Stockout Risk</h3>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockData}
                  innerRadius={90}
                  outerRadius={130}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                >
                  {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-6">
            {stockData.map(entry => (
              <div key={entry.name} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm font-bold text-gray-700">{entry.name} <span className="text-gray-400 font-normal">({entry.value})</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
