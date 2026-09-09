import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';

const Dashboard = ({ items }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-flex-dark flex items-center gap-2">
          <Package className="w-5 h-5 text-flex-blue" />
          Inventory Status
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
              <th className="p-3 font-medium">SKU</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Facility</th>
              <th className="p-3 font-medium">Quantity</th>
              <th className="p-3 font-medium">Threshold</th>
              <th className="p-3 font-medium">Status</th>
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
                  <td className="p-3">
                    {isLowStock ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                        <AlertTriangle className="w-3 h-3" />
                        Low Stock
                      </span>
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
    </div>
  );
};

export default Dashboard;
