import React from 'react';
import { Info } from 'lucide-react';

const InsightBanner = ({ items, hazards }) => {
  const lowStockCount = items.filter(item => item.quantity < item.reorderThreshold).length;
  const highSeverityHazards = hazards.filter(h => h.severity === 'high').length;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3 mb-6">
      <Info className="w-5 h-5 text-flex-blue shrink-0 mt-0.5" />
      <div>
        <h3 className="text-sm font-semibold text-flex-blue">AI Insights Summary</h3>
        <p className="text-sm text-blue-800 mt-1">
          Currently monitoring {items.length} total SKUs. 
          There {lowStockCount === 1 ? 'is' : 'are'} <span className="font-bold">{lowStockCount} item{lowStockCount !== 1 && 's'} below reorder threshold</span>. 
          {hazards.length > 0 && ` There are ${hazards.length} open safety reports (${highSeverityHazards} high severity).`}
        </p>
      </div>
    </div>
  );
};

export default InsightBanner;
