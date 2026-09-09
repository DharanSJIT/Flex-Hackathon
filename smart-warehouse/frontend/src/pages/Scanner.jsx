import React, { useState } from 'react';
import { Camera, Maximize, X, Package } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const Scanner = () => {
  const { items, loading } = useOutletContext();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItem, setScannedItem] = useState(null);

  const startScan = () => {
    setIsScanning(true);
    setScannedItem(null);
    // Simulate a scan delay
    setTimeout(() => {
      setIsScanning(false);
      if (items.length > 0) {
        // Pick a random item
        const randomItem = items[Math.floor(Math.random() * items.length)];
        setScannedItem(randomItem);
      }
    }, 2000);
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading system...</div>;

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-flex-dark">Barcode Scanner</h1>
        <p className="text-gray-500">Use your device camera to scan items on the floor.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Camera Viewfinder Mock */}
        <div className="relative w-full h-80 bg-gray-900 flex items-center justify-center overflow-hidden">
          {isScanning ? (
            <>
              <div className="absolute inset-0 bg-black/40 z-10"></div>
              {/* Animated scan line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_15px_#22c55e] z-20 animate-[scan_2s_ease-in-out_infinite]"></div>
              <p className="text-white z-20 font-mono text-sm">Scanning...</p>
            </>
          ) : (
            <button 
              onClick={startScan}
              className="z-20 bg-flex-blue text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg"
            >
              <Camera className="w-5 h-5" />
              Tap to Scan
            </button>
          )}
          
          {/* Mock Camera Feed Background */}
          <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed74514f6?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
          
          {/* Viewfinder borders */}
          <div className="absolute inset-8 border-2 border-white/30 rounded-lg pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white -mt-1 -ml-1"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white -mt-1 -mr-1"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white -mb-1 -ml-1"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white -mb-1 -mr-1"></div>
          </div>
        </div>

        {/* Scan Result */}
        <div className="p-6 bg-gray-50 min-h-[200px]">
          {scannedItem ? (
            <div className="animate-in slide-in-from-bottom-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-flex-dark">{scannedItem.name}</h3>
                    <p className="text-sm font-mono text-gray-500">{scannedItem.sku}</p>
                  </div>
                  <span className="bg-flex-blue text-white text-xs font-bold px-2 py-1 rounded">MATCH</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-gray-500">Current Stock</p>
                    <p className={`font-bold text-lg ${scannedItem.quantity < scannedItem.reorderThreshold ? 'text-red-600' : 'text-green-600'}`}>
                      {scannedItem.quantity} units
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-bold">{scannedItem.facility}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              {isScanning ? 'Analyzing barcode...' : 'Scan a barcode to view item details.'}
            </div>
          )}
        </div>
      </div>
      
      {/* Required CSS for scan animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default Scanner;
