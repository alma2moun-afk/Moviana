
import React from 'react';
import { GeneratedVideo } from '../types';

interface GalleryProps {
  videos: GeneratedVideo[];
}

const Gallery: React.FC<GalleryProps> = ({ videos }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="mb-12 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Video Gallery</h1>
          <p className="text-slate-400">All your AI-generated cinematic creations in one place.</p>
        </div>
        <div className="text-slate-500 text-sm">
          {videos.length} videos generated
        </div>
      </header>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {videos.map((vid) => (
            <div key={vid.id} className="group flex flex-col rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden">
              <div className="aspect-video relative bg-slate-800 overflow-hidden">
                <video src={vid.uri} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button 
                    onClick={() => {
                        const v = document.createElement('video');
                        v.src = vid.uri;
                        v.controls = true;
                        v.style.position = 'fixed';
                        v.style.top = '0';
                        v.style.left = '0';
                        v.style.width = '100vw';
                        v.style.height = '100vh';
                        v.style.zIndex = '9999';
                        v.style.background = 'black';
                        document.body.appendChild(v);
                        v.play();
                    }}
                    className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform"
                  >
                    <i className="fa-solid fa-play"></i>
                  </button>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-100 line-clamp-2 mb-4">
                    {vid.prompt}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {vid.aspectRatio}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(vid.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <a 
                    href={vid.uri} 
                    download={`video-${vid.id}.mp4`}
                    className="text-slate-500 hover:text-indigo-400 transition-colors"
                  >
                    <i className="fa-solid fa-download"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-40 rounded-3xl bg-slate-900/50 border-2 border-dashed border-slate-800">
          <i className="fa-solid fa-film text-slate-700 text-5xl mb-6"></i>
          <h3 className="text-xl font-bold text-slate-400 mb-2">Nothing to show yet</h3>
          <p className="text-slate-600">Start creating videos to populate your gallery.</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
