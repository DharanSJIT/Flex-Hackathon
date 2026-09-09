import React, { useState } from 'react';
import { AlertTriangle, Package, FileText, X, Loader2 } from 'lucide-react';
import axios from 'axios';

const Dashboard = ({ items }) => {
  const [poModal, setPoModal] = useState({ isOpen: false, item: null, text: '', loading: false });

  const generatePO = async (item) => {
    setPoModal({ isOpen: true, item, text: '', loading: true });
    try {
      const res = await axios.post('http://localhost:5001/api/po/generate', { item });
      setPoModal({ isOpen: true, item, text: res.data.poText, loading: false });
    } catch (err) {
      setPoModal({ isOpen: true, item, text: 'Error generating PO. Please try again.', loading: false });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-flex-dark flex items-center gap-2">
          <Package className="w-5 h-5 text-flex-blue" />
          Inventory Status
        </h2>
      </div>
      <div className="overflow-x-auto h-[600px] overflow-y-auto">
        <table className="w-full text-left border-collapse relative">
          <thead className="sticky top-0 bg-gray-50 shadow-sm z-10">
            <tr className="text-gray-600 text-sm border-b border-gray-200">
              <th className="p-3 font-medium">SKU</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Facility</th>
              <th className="p-3 font-medium">Quantity</th>
              <th className="p-3 font-medium">Threshold</th>
              <th className="p-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isLowStock = item.quantity < item.reorderThreshold;
              return (
                <tr 
                  key={item._id || item.sku} 
                  className={`border-b border-gray-100 ${isLowStock ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                >
                  <td className="p-3 font-mono text-sm">{item.sku}</td>
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3 text-gray-600">{item.facility}</td>
                  <td className="p-3 font-bold">{item.quantity}</td>
                  <td className="p-3 text-gray-500">{item.reorderThreshold}</td>
                  <td className="p-3 text-right">
                    {isLowStock ? (
                      <button 
                        onClick={() => generatePO(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
                      >
                        <FileText className="w-3 h-3" />
                        Generate PO
                      </button>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        Optimal
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No inventory data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PO Modal */}
      {poModal.isOpen && (
        <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 bg-flex-blue text-white flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <FileText className="w-4 h-4" /> 
                Purchase Order Draft
              </h3>
              <button onClick={() => setPoModal({ isOpen: false })} className="hover:bg-white/20 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex-1 min-h-[300px] overflow-y-auto bg-gray-50">
              {poModal.loading ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-flex-blue" />
                  <p>Gemini is drafting your PO...</p>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono bg-white p-4 border border-gray-200 rounded shadow-inner">
                  {poModal.text}
                </pre>
              )}
            </div>
            {!poModal.loading && (
              <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-2">
                <button onClick={() => setPoModal({ isOpen: false })} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button onClick={() => alert("PO Sent to Supplier!")} className="px-4 py-2 text-sm font-medium bg-flex-blue text-white rounded hover:bg-blue-600 shadow-sm">Send to Supplier</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
