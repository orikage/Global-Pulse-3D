import React from 'react';
import { NewsItem } from '../../types';
import { getCategoryColor } from '../Globe/utils';

interface SidebarProps {
  selectedNews: NewsItem | null;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedNews, onClose }) => {
  if (!selectedNews) return null;

  const categoryColor = getCategoryColor(selectedNews.category);

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-black/80 backdrop-blur-md border-l border-white/10 shadow-2xl transform transition-transform duration-300 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-start">
        <div>
            <span 
                className="inline-block px-2 py-1 text-xs font-bold rounded mb-2 text-black uppercase tracking-wider"
                style={{ backgroundColor: categoryColor }}
            >
                {selectedNews.category}
            </span>
            <h2 className="text-xl font-bold text-white leading-tight font-sans">{selectedNews.title}</h2>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
            <h3 className="text-xs uppercase text-gray-400 font-semibold tracking-widest mb-1">LOCATION</h3>
            <div className="flex items-center text-white/90 font-sans">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-neon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {selectedNews.locationName}
            </div>
        </div>

        <div>
            <h3 className="text-xs uppercase text-gray-400 font-semibold tracking-widest mb-2">SUMMARY</h3>
            <p className="text-gray-300 leading-relaxed text-sm font-sans">
                {selectedNews.summary}
            </p>
        </div>

        {selectedNews.url && (
             <div className="pt-4">
                <a 
                    href={selectedNews.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    記事全文を読む
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        )}
        
        <div className="text-xs text-gray-600 pt-8 border-t border-white/5">
            Intelligence provided by Gemini AI &bull; {new Date(selectedNews.timestamp || '').toLocaleString('ja-JP')}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;