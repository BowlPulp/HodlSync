import React, { useState, useEffect } from 'react';

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [floatingElements, setFloatingElements] = useState([]);
  const [helpVisible, setHelpVisible] = useState(false);
  const [siteMapVisible, setSiteMapVisible] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  
  // Changed to object for path mapping
  const validPaths = {
    'home': "/",
    'login': "/login",
    'signup': "/signup",
    'calculator': "/calculator/home",
    'contact': "/contact",
    'privacy': "/privacy",
    'pricing': "/pricing",
    'dashboard': "/user/home",
  };
  
  // Generate random floating tech elements
  useEffect(() => {
    const techTerms = [
      'crypto', 'erc-20', 'bitcoin', 'ethereum', 'blockchain', 'solidity',  
      'smart contract', 'nft', 'defi', 'staking', 'gas fees', 'hash', 'wallet',  
      'private key', 'public key', 'web3', 'metamask', 'ledger', 'tokenomics',  
      '</body>', '{}', '[];', 'console.log', '!important', 'undefined', 'null', '*{margin:0}'
    ];
    
    const newElements = [];
    
    for (let i = 0; i < 15; i++) {
      newElements.push({
        id: i,
        text: techTerms[i % techTerms.length],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1 + 0.5,
        speed: Math.random() * 3 + 1,
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }
    
    setFloatingElements(newElements);
    setIsVisible(true);
  }, []);
  
  // Matrix animation function implementation
  const startMatrixAnimation = () => {
    setMatrixActive(true);
    // This would be expanded with actual matrix animation logic
    setTimeout(() => setMatrixActive(false), 5000); // Auto-disable after 5 seconds
  };
  
  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setPosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Auto-redirect when correct page name is typed
  useEffect(() => {
    // Check if searchTerm exactly matches one of our valid paths
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    if (lowerCaseSearchTerm && validPaths[lowerCaseSearchTerm] && !redirecting) {
      setRedirecting(true);
      // Decreased redirect time to 500ms
      setTimeout(() => window.location.href = validPaths[lowerCaseSearchTerm], 500);
    }
  }, [searchTerm, redirecting]);
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    if (lowerCaseSearchTerm === "matrix") {
      // Start a matrix-like animation
      startMatrixAnimation();
    } else if (lowerCaseSearchTerm === "help") {
      // Show available commands
      setHelpVisible(true);
      setSiteMapVisible(false);
    } else if (lowerCaseSearchTerm === "sitemap") {
      setSiteMapVisible(true);
      setHelpVisible(false);
    } else if (lowerCaseSearchTerm && validPaths[lowerCaseSearchTerm] && !redirecting) {
      // Redirect to valid path
      setRedirecting(true);
      // Decreased redirect time to 500ms
      setTimeout(() => window.location.href = validPaths[lowerCaseSearchTerm], 500);
    }
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    
    // Reset redirecting state if user changes input
    if (redirecting) {
      setRedirecting(false);
    }
  };
  
  // Filter suggestions based on search term
  const filteredSuggestions = Object.keys(validPaths).filter(path => 
    path.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
    <div className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden ${matrixActive ? 'bg-black' : 'bg-gradient-to-bl from-green-900 via-teal-800 to-blue-900'}`}>
      {/* Animated background code elements */}
      {floatingElements.map((element) => (
        <div
        key={element.id}
        className="absolute text-green-200 opacity-30 font-mono whitespace-nowrap"
        style={{
          left: `${element.x}%`,
          top: `${element.y}%`,
          fontSize: `${element.size}rem`,
          animation: `float-${element.direction > 0 ? 'right' : 'left'} ${element.speed + 10}s infinite linear`,
          animationDelay: `${element.id * 0.3}s`
        }}
        >
          {element.text}
        </div>
      ))}
      
      {/* Glitch effect container */}
      <div 
        className="relative z-10 mb-8"
        style={{
          transform: `translate(${position.x / 4}px, ${position.y / 4}px)`
        }}
        >
        <h1 
          className="text-9xl font-bold text-white relative"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 1s ease-out"
          }}
          >
          <span className="relative inline-block">
            {/* Glitch layers */}
            <span className="absolute inset-0 text-blue-400" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-5px, 0)', animation: 'glitch-1 3s infinite' }}>404</span>
            <span className="absolute inset-0 text-green-400" style={{ clipPath: 'polygon(0 45%, 100% 45%, 100% 100%, 0 100%)', transform: 'translate(5px, 0)', animation: 'glitch-2 2.5s infinite' }}>404</span>
            <span className="absolute inset-0 text-white opacity-90" style={{ animation: 'glitch-text 3s infinite' }}>404</span>
            <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white to-green-200">404</span>
          </span>
        </h1>
      </div>
      
      {/* Main content */}
      <div 
        className="bg-black bg-opacity-30 backdrop-blur-lg p-8 rounded-lg border border-green-300 border-opacity-20 shadow-2xl max-w-xl w-full text-center"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
          transition: "opacity 1s ease-out 0.3s, transform 1s ease-out 0.3s",
        }}
        >
        <h2 className="text-3xl font-bold mb-4 text-white">Connection Lost</h2>
        <p className="text-green-200 mb-6">The page you're looking for has been disconnected from the server or doesn't exist.</p>
        
        {/* Fake terminal search */}
        <div className="bg-black rounded-md p-2 mb-6 text-left border border-green-500 border-opacity-30">
          <form onSubmit={handleSearch}>
            <div className="flex items-center text-green-400 font-mono text-sm">
              <span className="mr-2">$</span>
              <span className="mr-2">find-page</span>
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Enter page name..."
                className="bg-transparent focus:outline-none text-green-300 placeholder-green-700 flex-1"
                autoFocus
                />
              <button type="submit" className="ml-2 text-green-400 hover:text-green-300">→</button>
            </div>
          </form>
          
          {searchTerm && (
            <div className="text-xs mt-2">
              {validPaths[searchTerm.toLowerCase()] ? (
                <p className="text-green-400">
                  Page found! Redirecting to {validPaths[searchTerm.toLowerCase()]}...
                </p>
              ) : (
                <p className="text-red-400 font-mono text-xs">Error: Page "{searchTerm}" not found in directory. Try another location.</p>
              )}
            </div>
          )}
          
          {/* Filtered suggestions */}
          {searchTerm && filteredSuggestions.length > 0 && !redirecting && (
            <div className="mt-2 text-green-500 font-mono text-xs">
              <p>Suggested pages:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {filteredSuggestions.map(page => (
                  <a 
                  key={page} 
                  href={validPaths[page]} 
                  className="text-green-400 hover:text-green-300 hover:underline"
                  >
                    {page}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Help section */}
          {helpVisible && (
            <div className="mt-2 text-green-500 font-mono text-xs">
              <p>Available commands:</p>
              <ul className="mt-1 list-disc list-inside">
                <li>Type a page name to navigate (e.g., "home", "products")</li>
                <li>"matrix" - Start Matrix animation</li>
                <li>"sitemap" - Show site structure</li>
                <li>"help" - Show this help</li>
              </ul>
            </div>
          )}
          
          {/* Sitemap section */}
          {siteMapVisible && (
            <div className="mt-2 text-green-500 font-mono text-xs">
              <p>Site structure:</p>
              <div className="ml-2 mt-1">
                {Object.entries(validPaths).map(([name, path]) => (
                  <div key={name} className="flex items-start">
                    <span className="mr-2">├─</span>
                    <a 
                      href={path} 
                      className="text-green-400 hover:text-green-300 hover:underline"
                      >
                      {name}: {path}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-center space-x-4">
          <a
            href="/"
            className="px-6 py-3 rounded-md bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium hover:from-green-500 hover:to-teal-500 transition-all duration-300 shadow-lg shadow-green-900/30 hover:shadow-xl hover:shadow-green-900/40 transform hover:-translate-y-1 active:translate-y-0"
            >
            Return to Dashboard
          </a>
        </div>
      </div>
      
      {/* Popular pages section */}
      <div className="mt-6">
        <div className="mt-2 text-green-500 font-mono text-xs">
          <p>Popular pages:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.entries(validPaths).map(([name, path]) => (
              <a 
              key={name} 
              href={path} 
              className="text-green-400 hover:text-green-300 hover:underline"
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>
      
      {/* Creative navigation dots */}
      {/* <div 
        className="absolute bottom-8 flex space-x-2"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1s ease-out 0.6s",
        }}
        >
        {[...Array(5)].map((_, i) => (
          <div 
          key={i} 
          className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-green-400' : 'bg-white bg-opacity-30'} transition-all duration-300 hover:bg-green-400 cursor-pointer`}
          onClick={() => i === 0 ? window.location.href = '/' : null}
          />
        ))}
      </div> */}
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-right {
          from { transform: translateX(-20vw) translateY(0); }
          to { transform: translateX(120vw) translateY(-5vh); }
          }
          
          @keyframes float-left {
            from { transform: translateX(120vw) translateY(0); }
            to { transform: translateX(-20vw) translateY(5vh); }
            }
            
            @keyframes glitch-1 {
              0%, 100% { transform: translate(-5px, 0); }
              50% { transform: translate(5px, -1px); }
              75% { transform: translate(-2px, 1px); }
              }
              
              @keyframes glitch-2 {
                0%, 100% { transform: translate(5px, 0); }
                50% { transform: translate(-5px, 1px); }
                75% { transform: translate(2px, -1px); }
                }
                
                @keyframes glitch-text {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.8; }
                  52% { opacity: 1; }
                  54% { opacity: 0.7; }
                  56% { opacity: 1; }
                  }
                  `}</style>
    </div>
    
                  </>
  );
};

export default NotFound;