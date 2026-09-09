import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

const Inventory = () => {
  const { items, loading } = useOutletContext();

  if (loading) return <div className="text-center py-12 text-gray-500">Loading inventory data...</div>;

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-flex-dark">Global Inventory</h1>
        <p className="text-gray-500">Live view of SKUs across all active facilities.</p>
      </div>
      <Dashboard items={items} />
    </div>
  );
};

export default Inventory;
