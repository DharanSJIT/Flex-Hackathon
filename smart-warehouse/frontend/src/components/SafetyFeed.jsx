import React from 'react';
import { AlertCircle } from 'lucide-react';

const SafetyFeed = ({ hazards }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[500px] flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-flex-dark" />
        <h2 className="text-lg font-semibold text-flex-dark">Safety Alerts Feed</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50">
        {hazards.length === 0 ? (
          <div className="text-center text-gray-500 my-auto">No safety hazards reported.</div>
        ) : (
          hazards.map((hazard) => (
            <div key={hazard._id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                  hazard.severity === 'high' ? 'bg-red-100 text-red-700' :
                  hazard.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {hazard.severity} Severity
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(hazard.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-800">{hazard.description}</p>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                📍 {hazard.facility}
              </div>
              {hazard.imageUrl && (
                <div className="mt-2">
                  <img src={hazard.imageUrl} alt="Hazard" className="rounded max-h-32 object-cover border border-gray-200" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SafetyFeed;
