import React, { useState, useEffect, useCallback } from 'react';
import Scene from './components/Globe/Scene';
import Header from './components/UI/Header';
import Sidebar from './components/UI/Sidebar';
import { fetchGlobalNews } from './services/geminiService';
import { NewsItem } from './types';

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [apiKeyError, setApiKeyError] = useState<boolean>(false);

  const loadNews = useCallback(async () => {
    if (!process.env.API_KEY) {
        setApiKeyError(true);
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const data = await fetchGlobalNews();
      setNews(data);
    } catch (error) {
      console.error("Failed to load news", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleNewsSelect = (item: NewsItem) => {
    setSelectedNews(item);
  };

  const handleCloseSidebar = () => {
    setSelectedNews(null);
  };

  if (apiKeyError) {
      return (
          <div className="flex items-center justify-center h-screen bg-black text-white text-center p-4">
              <div>
                  <h1 className="text-2xl text-red-500 font-bold mb-4">Configuration Error</h1>
                  <p>No API Key found in environment variables.</p>
              </div>
          </div>
      )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <Header isLoading={loading} onRefresh={loadNews} />
      
      {/* Main 3D Scene */}
      <Scene 
        newsItems={news} 
        onNewsSelect={handleNewsSelect}
        selectedNewsId={selectedNews?.id || null}
      />

      {/* Detail Sidebar */}
      <Sidebar selectedNews={selectedNews} onClose={handleCloseSidebar} />
      
      {/* Loading Overlay */}
      {loading && news.length === 0 && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-neon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl text-white font-light tracking-widest">INITIALIZING GLOBAL SCAN</h2>
            </div>
          </div>
      )}
    </div>
  );
};

export default App;