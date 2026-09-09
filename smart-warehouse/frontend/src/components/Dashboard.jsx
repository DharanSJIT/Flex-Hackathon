import React, { useState, useMemo } from 'react';
import { AlertTriangle, Package, FileText, X, Loader2, Search, Filter } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Dashboard = ({ items }) => {
  const [poModal, setPoModal] = useState({ isOpen: false, item: null, text: '', loading: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'LOW_STOCK', 'FACILITY_1'

  const generatePO = async (item) => {
    setPoModal({ isOpen: true, item, text: '', loading: true });
    try {
      const res = await axios.post('http://localhost:5001/api/po/generate', { item });
      setPoModal({ isOpen: true, item, text: res.data.poText, loading: false });
    } catch (err) {
      setPoModal({ isOpen: true, item, text: 'Error generating PO. Please try again.', loading: false });
    }
  };

  const filteredItems = useMemo(() => {
    if (!items) return [];
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesFilter = true;
      if (filter === 'LOW_STOCK') matchesFilter = item.quantity < item.reorderThreshold;
      if (filter === 'FACILITY_1') matchesFilter = item.facility === 'Facility 1';

      return matchesSearch && matchesFilter;
    });
  }, [items, searchTerm, filter]);

  const lowStockCount = items?.filter(i => i.quantity < i.reorderThreshold).length || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative flex flex-col">
      {/* Top Control Bar */}
      <div className="p-5 border-b border-gray-200 bg-white flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl font-bold text-flex-dark flex items-center gap-2">
          <Package className="w-6 h-6 text-flex-blue" />
          Live Inventory Feed
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search SKU or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-flex-blue focus:border-transparent outline-none w-full sm:w-64"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${filter === 'ALL' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('LOW_STOCK')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1 ${filter === 'LOW_STOCK' ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Low Stock <span className="bg-red-500 text-white px-1.5 rounded-full text-[10px]">{lowStockCount}</span>
            </button>
            <button 
              onClick={() => setFilter('FACILITY_1')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${filter === 'FACILITY_1' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Facility 1
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto h-[600px] overflow-y-auto">
        <table className="w-full text-left border-collapse relative">
          <thead className="sticky top-0 bg-gray-50 shadow-sm z-10">
            <tr className="text-gray-600 text-sm border-b border-gray-200">
              <th className="p-4 font-bold uppercase tracking-wider text-xs">SKU</th>
              <th className="p-4 font-bold uppercase tracking-wider text-xs">Product Details</th>
              <th className="p-4 font-bold uppercase tracking-wider text-xs">Facility</th>
              <th className="p-4 font-bold uppercase tracking-wider text-xs min-w-[200px]">Stock Health</th>
              <th className="p-4 font-bold uppercase tracking-wider text-xs text-right">AI Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const isLowStock = item.quantity < item.reorderThreshold;
              // Calculate fill percentage for the progress bar (max 2x threshold for visual scale)
              const maxScale = item.reorderThreshold * 2;
              const fillPercent = Math.min(100, Math.max(0, (item.quantity / maxScale) * 100));
              
              return (
                <tr 
                  key={item._id || item.sku} 
                  className={`border-b border-gray-100 transition-colors ${isLowStock ? 'bg-red-50/50 hover:bg-red-50' : 'hover:bg-gray-50'}`}
                >
                  <td className="p-4 font-mono text-sm text-gray-500">{item.sku}</td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">Threshold: {item.reorderThreshold} units</div>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.facility}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-gray-800'}`}>
                        {item.quantity} <span className="text-xs font-normal text-gray-500">in stock</span>
                      </span>
                      {isLowStock && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>
                    {/* Visual Stock Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isLowStock ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${fillPercent}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {isLowStock ? (
                      <button 
                        onClick={() => generatePO(item)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-all shadow-sm hover:shadow active:scale-95"
                      >
                        <FileText className="w-4 h-4" />
                        AI Generate PO
                      </button>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                        Stock Optimal
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="5" className="p-12 text-center text-gray-500">
                  <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="font-medium text-lg">No inventory items found.</p>
                  <p className="text-sm">Try adjusting your search or filters.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PO Modal */}
      {poModal.isOpen && (
        <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
            <div className="p-5 bg-gradient-to-r from-flex-dark to-gray-800 text-white flex items-center justify-between shrink-0">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-flex-blue" /> 
                AI Purchase Order Draft
              </h3>
              <button onClick={() => setPoModal({ isOpen: false })} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
              {poModal.loading ? (
                <div className="h-[300px] flex flex-col items-center justify-center text-gray-500 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-flex-blue" />
                  <p className="font-medium">Gemini AI is drafting your optimal Purchase Order...</p>
                </div>
              ) : (
                <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-inner prose prose-sm prose-blue max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {poModal.text}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            {!poModal.loading && (
              <div className="p-5 border-t border-gray-200 bg-white flex justify-end gap-3">
                <button onClick={() => setPoModal({ isOpen: false })} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={() => { alert("PO Sent to Supplier via EDI!"); setPoModal({isOpen: false}); }} className="px-5 py-2.5 text-sm font-bold bg-flex-blue text-white rounded-xl hover:bg-blue-600 shadow-md transition-all active:scale-95 flex items-center gap-2">
                  Approve & Send PO
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
