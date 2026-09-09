import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2, Mic, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SUGGESTED_PROMPTS = [
  "What is the total value of items currently low in stock?",
  "Draft a PO for Widget A to replenish 500 units.",
  "Which facility has the highest optimization rate?",
  "Analyze the demand forecast for Sensor B over the next month."
];

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to the FlexWare AI Command Center. I can analyze stock levels, generate intelligent POs, and forecast demand. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }

  const toggleListen = () => {
    if (!recognition) return alert("Speech recognition is not supported in your browser.");
    
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendQuery = async (queryText) => {
    if (!queryText.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: queryText.trim() }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/api/assistant/ask', {
        question: queryText.trim()
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.answer }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error checking the inventory systems.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendQuery(input);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-flex-dark">
          <Sparkles className="w-5 h-5 text-flex-blue" />
          <h2 className="font-bold text-sm uppercase tracking-wider">Gemini AI Stream</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Connected
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 bg-white">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-gray-100 text-gray-700 border border-gray-200' : 'bg-flex-blue text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-flex-blue text-white rounded-tr-none shadow-md font-medium' 
                  : 'bg-gray-50 border border-gray-200 rounded-tl-none text-gray-800 shadow-sm'
              }`}>
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm prose-blue max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 flex-row max-w-[80%]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-flex-blue text-white shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 rounded-tl-none flex items-center gap-3 shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-flex-blue" />
                <span className="text-sm font-medium text-gray-500">Gemini is analyzing warehouse data...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col gap-3">
        {/* Quick Prompts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">Suggested:</span>
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendQuery(prompt)}
              disabled={isLoading}
              className="shrink-0 bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-flex-light hover:border-gray-300 transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <button
            type="button"
            onClick={toggleListen}
            className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
              isListening 
                ? 'bg-red-100 border-red-300 text-red-600 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-800 shadow-sm'
            }`}
            title="Use Voice Command"
          >
            <Mic className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
             <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or type a command..."
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-flex-blue focus:ring-2 focus:ring-blue-100 text-sm shadow-sm transition-all"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-flex-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;
