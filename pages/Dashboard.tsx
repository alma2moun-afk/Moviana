
import React from 'react';
import { AppView, GeneratedVideo } from '../types';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
  videos: GeneratedVideo[];
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, videos }) => {
  const recentVideos = videos.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Creator</h1>
        <p className="text-slate-400">Your creative studio is ready. What will you build today?</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Main CTA */}
        <div 
          onClick={() => onNavigate(AppView.CREATE)}
          className="lg:col-span-2 group relative overflow-hidden rounded-3xl bg-indigo-600 p-8 h-80 flex flex-col justify-end cursor-pointer transition-all hover:scale-[1.01]"
        >
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-700">
            <i className="fa-solid fa-circle-play text-[12rem]"></i>
          </div>
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm">
              <i className="fa-solid fa-plus text-white text-xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Create New Video</h2>
            <p className="text-white/80 max-w-md">Start from scratch using text prompts or provide an image to guide the AI generation process.</p>
          </div>
        </div>

        {/* Secondary Info */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 h-80 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Generated</span>
                <span className="font-mono text-indigo-400">{videos.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Usage Limit</span>
                <span className="font-mono">Unlimited</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current Model</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-xs font-medium text-slate-300">Veo 3.1 Fast</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onNavigate(AppView.PRICING)}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Upgrade Plan
          </button>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Projects</h2>
          <button 
            onClick={() => onNavigate(AppView.GALLERY)}
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            View all projects
          </button>
        </div>

        {recentVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentVideos.map((vid) => (
              <div key={vid.id} className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
                <div className="aspect-video bg-slate-800 flex items-center justify-center">
                  <video src={vid.uri} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <i className="fa-solid fa-play text-white text-3xl"></i>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium truncate mb-1">{vid.prompt}</p>
                  <p className="text-xs text-slate-500">{new Date(vid.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl bg-slate-900/50 border-2 border-dashed border-slate-800">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-clapperboard text-slate-500 text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-300 mb-1">No videos yet</h3>
            <p className="text-slate-500 mb-6">Your generated masterpieces will appear here.</p>
            <button 
              onClick={() => onNavigate(AppView.CREATE)}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
            >
              Create your first video
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
