import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, Package, Bot, Camera, Zap, TrendingUp } from 'lucide-react';

const Layout = ({ items, hazards, fetchData, loading }) => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-flex-blue text-white'
        : 'text-gray-500 hover:bg-blue-50 hover:text-flex-blue'
    }`;

  return (
    <div className="min-h-screen bg-flex-light">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-flex-blue text-white rounded flex items-center justify-center font-bold text-xl">
              F
            </div>
            <h1 className="text-xl font-bold text-flex-dark tracking-tight hidden sm:block">Smart Warehouse</h1>
          </NavLink>

          <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
            <NavLink to="/" className={navLinkClass} end>
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden md:block">Overview</span>
            </NavLink>
            <NavLink to="/inventory" className={navLinkClass}>
              <Package className="w-4 h-4" />
              <span className="hidden md:block">Inventory</span>
            </NavLink>
            <NavLink to="/smartflow" className={navLinkClass}>
              <Zap className="w-4 h-4" />
              <span className="hidden md:block">SmartFlow</span>
            </NavLink>
            <NavLink to="/forecast" className={navLinkClass}>
              <TrendingUp className="w-4 h-4" />
              <span className="hidden md:block">Demand AI</span>
            </NavLink>
            <NavLink to="/scanner" className={navLinkClass}>
              <Camera className="w-4 h-4" />
              <span className="hidden md:block">Scanner</span>
            </NavLink>
            <NavLink to="/safety" className={navLinkClass}>
              <ShieldAlert className="w-4 h-4" />
              <span className="hidden md:block">Safety</span>
            </NavLink>
            <NavLink to="/assistant" className={navLinkClass}>
              <Bot className="w-4 h-4" />
              <span className="hidden md:block">AI Assistant</span>
            </NavLink>
          </nav>
          
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet context={{ items, hazards, fetchData, loading }} />
      </main>
    </div>
  );
};

export default Layout;
