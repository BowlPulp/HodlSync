import React, { useState, useEffect, useRef } from "react";
import { Loader, Send, Trash2, ArrowRight, Clock, ChevronDown, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify"; // Added for security

const AICalculator = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [displayedResult, setDisplayedResult] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyWidth, setHistoryWidth] = useState("0px");
  const [abortController, setAbortController] = useState(null);
  const [typingCancelled, setTypingCancelled] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const historyRef = useRef(null);
  
  // Load API key from environment variable
  const API_KEY = import.meta.env.VITE_REACT_APP_GEMINI_API_KEY || "";
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayedResult, loading]);

  // Format markdown in the response
  const formatMarkdown = (text) => {
    if (!text) return "";
    
    // Replace markdown headers
    const formattedText = text
      // Headers
      .replace(/\*\*\*(.*?)\*\*\*/g, '<h3 class="text-lg font-bold my-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^- (.*?)$/gm, '<li class="ml-4">• $1</li>')
      // Line breaks
      .split('\n').join('<br />');
    
    // Sanitize the HTML before returning
    return DOMPurify.sanitize(formattedText);
  };

  // Typing effect with cancellation support
  useEffect(() => {
    // Clear any existing timeout when component updates
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (result && result !== displayedResult && !typingCancelled) {
      setIsTyping(true);
      let i = displayedResult.length;
      const typingSpeed = 20;
  
      const typeWriter = () => {
        if (i < result.length && !typingCancelled) {
          setDisplayedResult(result.substring(0, i + 1));
          i++;
          typingTimeoutRef.current = setTimeout(typeWriter, typingSpeed);
        } else {
          setIsTyping(false);
          typingTimeoutRef.current = null;
        }
      };
  
      typeWriter();
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [result, displayedResult, typingCancelled]);
  

  // Adjust history width based on visibility
  useEffect(() => {
    if (showHistory) {
      const width = window.innerWidth < 768 ? "16rem" : "18rem";
      setHistoryWidth(width);
    } else {
      setHistoryWidth("0px");
    }
  }, [showHistory]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Convert string timestamps back to Date objects
        const formattedHistory = parsedHistory.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistory(formattedHistory);
      } catch (e) {
        console.error('Error parsing history from localStorage', e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('calculatorHistory', JSON.stringify(history));
    }
  }, [history]);

  // Cancel API request and/or typing animation
  const cancelRequest = () => {
    // First, check if we're in the loading state (API fetching)
    if (loading && abortController) {
      abortController.abort();
      setAbortController(null);
      setLoading(false);
      setError("Request canceled");
    } 
    // Then check if we're in typing state
    else if (isTyping) {
      setTypingCancelled(true);
      setIsTyping(false);
      
      // Still save what we've displayed so far to history
      if (displayedResult) {
        const partialResult = displayedResult;
        setHistory(prev => {
          const newHistory = [...prev, { 
            query,
            result: partialResult + " [truncated]", 
            timestamp: new Date() 
          }];
          return newHistory.slice(-100);
        });
      }
      
      // Clear the timeout 
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  };

  const fetchFinancialData = async () => {
    if (!query.trim()) return;
    if (!API_KEY) {
      setError("API key not configured. Please set the REACT_APP_GEMINI_API_KEY environment variable.");
      return;
    }
    
    // Reset typing states
    setTypingCancelled(false);
    
    // Cancel any ongoing request
    if (abortController) {
      abortController.abort();
    }
    
    // Create a new AbortController
    const controller = new AbortController();
    setAbortController(controller);
    
    setLoading(true);
    setResult(null);
    setDisplayedResult("");
    setError(null);

    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ 
            parts: [{ text: `Calculate and explain: ${query}` }]
          }] 
        }),
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const calculationResult = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No result found.";
      
      // Only set the full result if typing wasn't cancelled earlier
      if (!typingCancelled) {
        setResult(calculationResult);
      }
      
      // Don't save to history here - we'll save on completion or cancellation of typing
    } catch (error) {
      // Don't show error if it was aborted intentionally
      if (error.name !== 'AbortError') {
        console.error("API Error:", error);
        setError(`Error fetching data: ${error.message}. Please check your query and try again.`);
      }
    } finally {
      setAbortController(null);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchFinancialData();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
      localStorage.removeItem('calculatorHistory');
    }
  };

  const handleHistoryItemClick = (item) => {
    setQuery(item.query);
    setResult(item.result);
    setDisplayedResult("");  // Reset displayed result to trigger typing effect
    setTypingCancelled(false);
    
    if (window.innerWidth < 768) {
      setShowHistory(false);
    }
  };

  // Toggle history visibility
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  // Close history when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHistory && 
          window.innerWidth < 768 && 
          historyRef.current && 
          !historyRef.current.contains(event.target) &&
          !event.target.closest('button[aria-label="Toggle history"]')) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHistory]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyboardShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        fetchFinancialData();
      } else if (e.key === 'Escape' && (loading || isTyping)) {
        cancelRequest();
      }
    };
    
    document.addEventListener('keydown', handleKeyboardShortcut);
    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcut);
    };
  }, [query, loading, isTyping]);

  // Save completed responses to history when typing is complete
  useEffect(() => {
    if (result && !isTyping && !typingCancelled && displayedResult === result) {
      // Save to history when typing completes naturally
      setHistory(prev => {
        const newHistory = [...prev, { 
          query, 
          result: displayedResult, 
          timestamp: new Date() 
        }];
        return newHistory.slice(-100);
      });
    }
  }, [isTyping, result, displayedResult]);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-black via-gray-800 to-green-900">
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-3 md:p-4 shadow-lg mt-28">
        <h2 className="text-xl md:text-2xl font-bold text-center text-white flex items-center justify-center">
          <Info className="w-5 h-5 mr-2" /> AI Financial Calculator
        </h2>
      </div>
      
      {/* Main container */}
      <div className="flex flex-col flex-grow overflow-hidden p-2 md:p-4">
        <div ref={chatContainerRef} className="flex flex-grow max-w-3xl mx-auto w-full rounded-xl md:rounded-2xl overflow-hidden bg-white shadow-xl">
          
          {/* Sidebar for history */}
          <div
            ref={historyRef}
            style={{ 
              width: historyWidth,
              transition: "width 0.3s ease-in-out",
              overflow: "hidden"
            }}
            className="relative z-10 h-full bg-gray-50 border-r border-gray-200 flex-shrink-0"
          >
            <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-100">
              <h3 className="font-medium text-gray-700 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                History
              </h3>
              <div className="flex items-center">
                <button 
                  onClick={handleClearHistory}
                  className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-200"
                  aria-label="Clear history"
                  title="Clear history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={toggleHistory}
                  className="ml-1 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 md:hidden"
                  aria-label="Close history"
                >
                  <ChevronDown className="w-4 h-4 transform rotate-90" />
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto h-full pb-16">
              {history.length === 0 ? (
                <p className="text-sm text-gray-500 p-3 text-center">No history yet</p>
              ) : (
                <div className="space-y-1 p-2">
                  {history.slice().reverse().map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleHistoryItemClick(item)}
                      className="p-2 hover:bg-indigo-50 rounded cursor-pointer border border-transparent hover:border-indigo-100 transition-colors"
                    >
                      <p className="text-sm font-medium truncate">{item.query}</p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(item.timestamp)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Main chat area */}
          <div className="flex flex-col flex-grow">
            {/* Chat messages */}
            <div className="flex-grow p-3 md:p-4 overflow-y-auto bg-gray-50">
              {/* Welcome message */}
              <div className="flex items-start mb-4">
                <div className="min-w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-3">
                  <img src="/sync.png" alt="AI" className="w-8 h-8" />
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm max-w-3/4">
                  <p className="text-sm md:text-base">Welcome to AI Financial Calculator! Ask me financial questions or calculations.</p>
                  <p className="text-xs text-gray-500 mt-2">Try "What would $10,000 be worth in 20 years with 8% annual returns?"</p>
                </div>
              </div>
              
              {/* User query and result */}
              {(query || displayedResult || error) && (
                <>
                  {/* User message */}
                  {query && (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="flex items-start justify-end mb-4"
                    >
                      <div className="bg-indigo-600 p-3 rounded-lg shadow-sm text-white max-w-3/4">
                        <p className="text-sm md:text-base break-words">{query}</p>
                      </div>
                      <div className="min-w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 ml-3">
                        <span className="text-gray-600 text-xs md:text-sm font-bold">You</span>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Loading indicator with cancel button */}
                  {loading && (
                    <div className="flex items-start mb-4">
                      <div className="min-w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-3">
                        <img src="/sync.png" alt="AI" className="w-8 h-8" />
                      </div>
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-3 rounded-lg shadow-sm inline-flex items-center"
                      >
                        <span className="flex items-center text-sm md:text-base">
                          <Loader className="w-4 h-4 mr-2 animate-spin text-indigo-600" />
                          HODLSync is thinking...
                        </span>
                        <button
                          onClick={cancelRequest}
                          className="ml-3 text-red-500 hover:text-red-700 transition-colors flex items-center rounded-full p-1 hover:bg-red-50"
                          aria-label="Cancel request"
                          title="Cancel (or press Esc)"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    </div>
                  )}
                  
                  {/* Error message */}
                  {error && (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="flex items-start mb-4"
                    >
                      <div className="min-w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-3">
                        <img src="/sync.png" alt="AI" className="w-8 h-8" />
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-red-700 max-w-3/4">
                        <p className="text-sm md:text-base">{error}</p>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Result message with cancel button during typing */}
                  {displayedResult && (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="flex items-start mb-4"
                    >
                      <div className="min-w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-3">
                        <img src="/sync.png" alt="AI" className="w-8 h-8" />
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm max-w-3/4 relative group">
                        <div 
                          className="text-gray-800 prose prose-sm" 
                          dangerouslySetInnerHTML={{ __html: formatMarkdown(displayedResult) }}
                        />
                        {isTyping && (
                          <>
                            <span className="inline-block w-1 h-4 bg-indigo-600 ml-1 animate-pulse"></span>
                            <button
                              onClick={cancelRequest}
                              className="absolute right-0 top-0 mt-1 mr-1 text-red-500 hover:text-red-700 bg-white bg-opacity-80 hover:bg-opacity-100 transition-all rounded-full p-1 opacity-0 group-hover:opacity-100 shadow-sm"
                              aria-label="Stop generating"
                              title="Stop generating (Esc)"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {typingCancelled && displayedResult.length > 0 && (
                          <div className="inline-flex items-center ml-2 text-xs text-gray-500">
                            <span>[stopped]</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <div className="p-2 md:p-3 bg-white border-t border-gray-200">
              <div className="flex rounded-full border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
                <button 
                  onClick={toggleHistory}
                  className="px-2 md:px-3 py-2 text-gray-500 hover:text-indigo-600 transition-colors"
                  aria-label="Toggle history"
                  title="View history"
                >
                  <ChevronDown className={`w-5 h-5 transform transition-transform ${showHistory ? 'rotate-180' : ''}`} />
                </button>
                
                <input 
                  type="text" 
                  placeholder="Ask a financial question..." 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-grow py-2 md:py-3 px-2 focus:outline-none text-gray-700 text-sm md:text-base"
                  aria-label="Financial query input"
                />
                
                <button 
                  onClick={fetchFinancialData} 
                  disabled={loading || !query.trim()}
                  className={`px-3 md:px-4 py-2 flex items-center justify-center ${loading || !query.trim() ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-800'} transition-colors`}
                  aria-label="Send"
                  title="Send (or press Ctrl+Enter)"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-xs text-gray-500 text-center mt-2">
                Try asking about compound interest, investment returns, or loan payments
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-2 md:p-3 text-center text-white text-opacity-70 text-xs md:text-sm">
        <p>Powered by Gemini Pro API • All calculations are estimates</p>
      </div>
    </div>
  );
};

export default AICalculator;