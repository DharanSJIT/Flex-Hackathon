import React, { useState, useMemo } from 'react';
import { TrendingUp, AlertTriangle, PackageSearch, Activity, BrainCircuit, Box, ShieldCheck, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// Hardcoded Base Dataset for the Hackathon Demo
const baseProducts = [
  {
    id: 'P001',
    name: 'Sensor B',
    score: 94,
    category: 'Sensors',
    currentStock: 80,
    baseDailyDemand: 52,
    baseMonthlyDemand: 1560,
    baseYearlyDemand: 18500,
    leadTime: 7,
    growth: 18,
    peakMonth: 'December'
  },
  {
    id: 'P002',
    name: 'Motor A',
    score: 89,
    category: 'Motors',
    currentStock: 120,
    baseDailyDemand: 45,
    baseMonthlyDemand: 1420,
    baseYearlyDemand: 16000,
    leadTime: 14,
    growth: 12,
    peakMonth: 'July'
  },
  {
    id: 'P003',
    name: 'Cable C',
    score: 76,
    category: 'Wiring',
    currentStock: 200,
    baseDailyDemand: 31,
    baseMonthlyDemand: 1150,
    baseYearlyDemand: 13000,
    leadTime: 5,
    growth: 5,
    peakMonth: 'August'
  },
  {
    id: 'P004',
    name: 'Switch D',
    score: 48,
    category: 'Electronics',
    currentStock: 500,
    baseDailyDemand: 18,
    baseMonthlyDemand: 540,
    baseYearlyDemand: 6500,
    leadTime: 30,
    growth: -2,
    peakMonth: 'January'
  },
  {
    id: 'P005',
    name: 'Bracket E',
    score: 22,
    category: 'Hardware',
    currentStock: 950,
    baseDailyDemand: 5,
    baseMonthlyDemand: 150,
    baseYearlyDemand: 1800,
    leadTime: 45,
    growth: -10,
    peakMonth: 'March'
  }
];

// Recharts Dummy data for Yearly Trend of top item
const generateChartData = (multiplier) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => {
    // Sensor B base curve with a peak in December
    const baseValue = 1000 + (Math.pow(index, 2) * 8); 
    return {
      name: month,
      demand: Math.round(baseValue * (1 + multiplier / 100))
    };
  });
};

const DemandForecast = () => {
  const [demandMultiplier, setDemandMultiplier] = useState(0); // What-If Simulator State (0 to 100%)

  // Recalculate metrics dynamically based on the What-If slider
  const simulatedProducts = useMemo(() => {
    return baseProducts.map(p => {
      const multiplier = 1 + (demandMultiplier / 100);
      const daily = Math.round(p.baseDailyDemand * multiplier);
      const monthly = Math.round(p.baseMonthlyDemand * multiplier);
      const yearly = Math.round(p.baseYearlyDemand * multiplier);
      
      const daysOfStock = daily > 0 ? (p.currentStock / daily).toFixed(1) : '∞';
      
      let risk = '🟢 LOW';
      let riskColor = 'text-green-500';
      if (daysOfStock <= p.leadTime) {
        risk = '🔴 CRITICAL';
        riskColor = 'text-red-500';
      } else if (daysOfStock <= p.leadTime + 7) {
        risk = '🟠 MEDIUM';
        riskColor = 'text-orange-500';
      }

      // Reorder recommendation logic
      let reorderQty = 0;
      if (risk !== '🟢 LOW') {
        // Recommend ordering enough for next month + lead time safety
        reorderQty = monthly - p.currentStock + Math.round(daily * p.leadTime);
      }

      return {
        ...p,
        daily,
        monthly,
        yearly,
        daysOfStock,
        risk,
        riskColor,
        reorderQty
      };
    }).sort((a, b) => b.daily - a.daily); // Sort by highest daily demand
  }, [demandMultiplier]);

  const chartData = useMemo(() => generateChartData(demandMultiplier), [demandMultiplier]);
  const topProduct = simulatedProducts[0];

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-flex-dark flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-flex-blue" />
          FlexWare AI — Demand Intelligence
        </h1>
        <p className="text-gray-500 mt-2 text-lg max-w-3xl">
          FlexWare AI predicts what products your warehouse will need before you run out of them. 
          Use the What-If Simulator below to stress-test your supply chain.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Fast Moving Products Ranking */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            Fast Moving Products
          </h2>
          <div className="space-y-4 flex-1">
            {baseProducts.sort((a,b) => b.score - a.score).map((p, index) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-mono font-bold w-4">{index + 1}.</span>
                  <span className="font-semibold text-gray-800">{p.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-600">{p.score}/100</span>
                  {p.score >= 80 ? '🔥' : p.score >= 50 ? '🟠' : '🟢'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What-If Simulator Slider */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-sm border border-blue-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-flex-blue flex items-center gap-2 mb-1">
                <Activity className="w-5 h-5" />
                What-If Demand Simulator
              </h2>
              <p className="text-sm text-gray-500">Inject artificial demand spikes to see real-time supply chain impact.</p>
            </div>
            <div className="bg-flex-blue text-white font-bold px-4 py-2 rounded-lg shadow-sm">
              +{demandMultiplier}% Demand
            </div>
          </div>
          
          <div className="mt-8 px-2">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={demandMultiplier} 
              onChange={(e) => setDemandMultiplier(Number(e.target.value))}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-flex-blue"
            />
            <div className="flex justify-between text-xs font-bold text-gray-400 mt-2 px-1">
              <span>Normal (0%)</span>
              <span>Extreme (+100%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Horizons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Daily */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-bold tracking-wider mb-4 uppercase">Daily Forecast (Tomorrow)</h3>
          <ul className="space-y-4">
            {simulatedProducts.slice(0, 3).map(p => (
              <li key={p.id} className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">{p.name}</span>
                <span className="text-flex-blue font-bold">{p.daily} units</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Monthly */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-bold tracking-wider mb-4 uppercase">Monthly Forecast</h3>
          <ul className="space-y-4">
            {simulatedProducts.slice(0, 3).map(p => (
              <li key={p.id} className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">{p.name}</span>
                <span className="text-flex-blue font-bold">{p.monthly.toLocaleString()} units</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Yearly Insights */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-bold tracking-wider mb-4 uppercase">Yearly Insights ({topProduct.name})</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-gray-500">Total Demand:</span><span className="font-bold text-gray-800">{topProduct.yearly.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Base Growth:</span><span className="font-bold text-green-600">+{topProduct.growth}%</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Peak Month:</span><span className="font-bold text-gray-800">{topProduct.peakMonth}</span></div>
          </div>
        </div>
      </div>

      {/* Yearly Chart & Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-flex-blue" />
            12-Month Demand Trend ({topProduct.name})
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="demand" stroke="#0099DE" strokeWidth={4} dot={{ r: 4, fill: '#0099DE', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Action Center */}
        <div className="lg:col-span-1 bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100 flex flex-col">
          <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            AI Action Center
          </h3>
          
          <div className="flex-1 space-y-4 overflow-y-auto">
            {simulatedProducts.map(p => {
              if (p.risk === '🟢 LOW') return null; // Only show alerts
              
              return (
                <div key={p.id} className="bg-white p-4 rounded-xl border border-red-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-800">{p.name}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${p.riskColor.includes('red') ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                      {p.risk}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Stock-out expected in <strong className="text-red-500">{p.daysOfStock} days</strong> based on predicted demand of {p.daily} units/day.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">AI Recommendation</span>
                    <span className="text-sm font-semibold text-flex-dark">
                      Reorder {p.reorderQty > 0 ? p.reorderQty.toLocaleString() : 'inventory'} units immediately.
                    </span>
                  </div>
                </div>
              );
            })}
            {simulatedProducts.every(p => p.risk === '🟢 LOW') && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                <ShieldCheck className="w-8 h-8 text-green-400" />
                <p className="text-sm font-medium">All systems stable. No immediate actions required.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DemandForecast;
