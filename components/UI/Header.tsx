import React from 'react';

interface HeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoading, onRefresh }) => {
  return (
    <div className="absolute top-0 left-0 w-full z-40 p-6 flex justify-between items-start pointer-events-none">
      <div className="pointer-events-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          GLOBAL<span className="text-neon">PULSE</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1 tracking-widest uppercase">Live 24h Intelligence</p>
      </div>

      <button
        onClick={onRefresh}
        disabled={isLoading}
        className={`
          pointer-events-auto
          flex items-center space-x-2 px-4 py-2 rounded-full 
          bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md 
          transition-all duration-300 text-sm font-medium text-white
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>{isLoading ? 'Scanning...' : 'Refresh Data'}</span>
      </button>
    </div>
  );
};

export default Header;