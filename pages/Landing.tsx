
import React from 'react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>
      
      <div className="max-w-4xl w-full text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-indigo-400 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Powered by Gemini 3 & Veo
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
          The Future of <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Video Production
          </span>
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Transform your ideas into cinematic realities. Generate professional-grade videos from text prompts and images in minutes using state-of-the-art AI.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] flex items-center gap-3"
          >
            Start Creating Free
            <i className="fa-solid fa-arrow-right"></i>
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-2xl font-bold text-lg border border-slate-800 transition-all"
          >
            Billing Docs
          </a>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { 
              title: "Cinematic Quality", 
              desc: "Up to 1080p resolution with advanced temporal consistency.",
              icon: "fa-film"
            },
            { 
              title: "Text & Image to Video", 
              desc: "Start with a prompt or a starting frame to guide the AI.",
              icon: "fa-wand-magic-sparkles"
            },
            { 
              title: "Rapid Generation", 
              desc: "Optimized pipelines using Veo 3.1 Fast models.",
              icon: "fa-bolt"
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center mb-4">
                <i className={`fa-solid ${feature.icon} text-indigo-400 text-xl`}></i>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
