import React from 'react';
import ChatAssistant from '../components/ChatAssistant';

const Assistant = () => {
  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-flex-dark">Gemini Assistant</h1>
        <p className="text-gray-500">Ask any questions about the live inventory across all facilities.</p>
      </div>
      <div className="shadow-lg rounded-lg overflow-hidden">
        <ChatAssistant />
      </div>
    </div>
  );
};

export default Assistant;
