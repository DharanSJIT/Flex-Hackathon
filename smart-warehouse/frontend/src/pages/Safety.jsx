import React from 'react';
import { useOutletContext } from 'react-router-dom';
import HazardReport from '../components/HazardReport';
import SafetyFeed from '../components/SafetyFeed';

const Safety = () => {
  const { hazards, fetchData, loading } = useOutletContext();

  if (loading) return <div className="text-center py-12 text-gray-500">Loading safety records...</div>;

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-flex-dark">Safety & Hazard Management</h1>
        <p className="text-gray-500">Report issues and track open hazards in real-time.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HazardReport onHazardReported={fetchData} />
        <SafetyFeed hazards={hazards} />
      </div>
    </div>
  );
};

export default Safety;
