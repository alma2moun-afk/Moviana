
import React, { useState, useEffect } from 'react';
import { AppView, GeneratedVideo } from './types';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CreateVideo from './pages/CreateVideo';
import Gallery from './pages/Gallery';
import Pricing from './pages/Pricing';
import Library from './pages/Library';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [initialCreateData, setInitialCreateData] = useState<any>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
        if (selected && currentView === AppView.LANDING) setCurrentView(AppView.DASHBOARD);
      }
    };
    checkKey();

    const saved = localStorage.getItem('video_factory_history');
    if (saved) setVideos(JSON.parse(saved));
  }, []);

  const handleKeySelect = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
      setCurrentView(AppView.DASHBOARD);
    }
  };

  const handleUseAsset = (data: any) => {
    setInitialCreateData(data);
    setCurrentView(AppView.CREATE);
  };

  const addVideoToHistory = (video: GeneratedVideo) => {
    const newVideos = [video, ...videos];
    setVideos(newVideos);
    localStorage.setItem('video_factory_history', JSON.stringify(newVideos));
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.LANDING:
        return <Landing onStart={handleKeySelect} />;
      case AppView.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} videos={videos} />;
      case AppView.CREATE:
        return (
          <CreateVideo 
            initialData={initialCreateData}
            onVideoGenerated={addVideoToHistory} 
            onBack={() => {
              setInitialCreateData(null);
              setCurrentView(AppView.DASHBOARD);
            }} 
          />
        );
      case AppView.GALLERY:
        return <Gallery videos={videos} />;
      case AppView.LIBRARY:
        return <Library onUseAsset={handleUseAsset} />;
      case AppView.PRICING:
        return <Pricing />;
      default:
        return <Landing onStart={handleKeySelect} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {hasKey && currentView !== AppView.LANDING && (
        <Navbar currentView={currentView} onNavigate={(v) => {
          setInitialCreateData(null);
          setCurrentView(v);
        }} />
      )}
      <main className="flex-grow">
        {renderView()}
      </main>
      
      <footer className="py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Video Factory AI. Built with Gemini & Veo.</p>
      </footer>
    </div>
  );
};

export default App;
