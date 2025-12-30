
import React from 'react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const links = [
    { label: 'Dashboard', view: AppView.DASHBOARD, icon: 'fa-house' },
    { label: 'Create', view: AppView.CREATE, icon: 'fa-plus' },
    { label: 'Library', view: AppView.LIBRARY, icon: 'fa-book-open' },
    { label: 'Gallery', view: AppView.GALLERY, icon: 'fa-clapperboard' },
    { label: 'Pricing', view: AppView.PRICING, icon: 'fa-gem' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => onNavigate(AppView.DASHBOARD)}
      >
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
          <i className="fa-solid fa-video text-white text-xl"></i>
        </div>
        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Video Factory
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-1">
        {links.map((link) => (
          <button
            key={link.view}
            onClick={() => onNavigate(link.view)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentView === link.view 
              ? 'bg-slate-800 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <i className={`fa-solid ${link.icon} mr-2 opacity-70`}></i>
            {link.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block text-right mr-2">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Pro Account</p>
          <p className="text-xs text-indigo-400">Unlimited Credits</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors border border-slate-700">
          <i className="fa-solid fa-user text-slate-300"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
