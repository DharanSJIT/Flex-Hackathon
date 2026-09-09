import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Safety from './pages/Safety';
import Assistant from './pages/Assistant';
import Scanner from './pages/Scanner';
import SmartFlow from './pages/SmartFlow';
import DemandForecast from './pages/DemandForecast';
import LogisticsMap from './pages/LogisticsMap';

function App() {
  const [items, setItems] = useState([]);
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [itemsRes, hazardsRes] = await Promise.all([
        axios.get('http://localhost:5001/api/items'),
        axios.get('http://localhost:5001/api/hazards')
      ]);
      setItems(itemsRes.data);
      setHazards(hazardsRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout items={items} hazards={hazards} fetchData={fetchData} loading={loading} />}>
        <Route index element={<Home />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="smartflow" element={<SmartFlow />} />
        <Route path="forecast" element={<DemandForecast />} />
        <Route path="logistics" element={<LogisticsMap />} />
        <Route path="scanner" element={<Scanner />} />
        <Route path="safety" element={<Safety />} />
        <Route path="assistant" element={<Assistant />} />
      </Route>
    </Routes>
  );
}

export default App;
