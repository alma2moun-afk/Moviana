
import React, { useState, useRef, useEffect } from 'react';
import { VideoConfig, GeneratedVideo, AudioLayer } from '../types';
import { generateVideo } from '../services/geminiService';

interface CreateVideoProps {
  initialData?: any;
  onVideoGenerated: (video: GeneratedVideo) => void;
  onBack: () => void;
}

const CreateVideo: React.FC<CreateVideoProps> = ({ initialData, onVideoGenerated, onBack }) => {
  const [prompt, setPrompt] = useState(initialData?.prompt || '');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
  const [image, setImage] = useState<string | null>(initialData?.image || null);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(initialData?.voiceName || null);
  const [language, setLanguage] = useState<string>(initialData?.language || 'ar');
  
  // Audio Mixer State
  const [audioLayers, setAudioLayers] = useState<AudioLayer[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resultUri, setResultUri] = useState<string | null>(null);

  useEffect(() => {
    if (initialData?.audioLayer) {
      const newLayer: AudioLayer = {
        id: Math.random().toString(36).substr(2, 9),
        trackId: initialData.audioLayer.trackId,
        name: initialData.audioLayer.name,
        url: initialData.audioLayer.url,
        clipStart: 0,
        clipEnd: 30, // Default 30s clip
        timelineOffset: audioLayers.length > 0 ? audioLayers[audioLayers.length-1].timelineOffset + 30 : 0,
        volume: 0.5,
        eq: { bass: 0, mid: 0, treble: 0 }
      };
      setAudioLayers(prev => [...prev, newLayer]);
    }
  }, [initialData]);

  const updateLayer = (id: string, updates: Partial<AudioLayer>) => {
    setAudioLayers(layers => layers.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const removeLayer = (id: string) => {
    setAudioLayers(layers => layers.filter(l => l.id !== id));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe your scene.");
      return;
    }
    setError(null);
    setIsGenerating(true);
    setResultUri(null);

    try {
      const config: VideoConfig = {
        prompt, aspectRatio, resolution, image: image || undefined,
        voiceId: initialData?.voiceId, language, audioLayers
      };
      const uri = await generateVideo(config, setStatusMessage);
      const newVideo: GeneratedVideo = {
        id: Math.random().toString(36).substr(2, 9),
        prompt, uri, timestamp: Date.now(), status: 'completed', aspectRatio
      };
      setResultUri(uri);
      onVideoGenerated(newVideo);
    } catch (err: any) {
      setError(err.message || "Production failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAutoMix = () => {
    // Simulate AI mixing based on description
    setStatusMessage("AI is analyzing scene mood...");
    setTimeout(() => {
      setAudioLayers(layers => layers.map(l => ({
        ...l,
        eq: { bass: -4, mid: -2, treble: 4 }, // "Cinematic Mood" Preset
        volume: 0.3
      })));
      setStatusMessage("Mixing complete.");
      setTimeout(() => setStatusMessage(""), 2000);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center mb-10">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
          <i className={`fa-solid ${language === 'ar' ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
          {language === 'ar' ? 'العودة' : 'Back'}
        </button>
        <div className="flex gap-4">
           <button 
             onClick={handleAutoMix}
             className="px-4 py-2 rounded-xl bg-indigo-600/10 border border-indigo-600/30 text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
           >
             <i className="fa-solid fa-wand-magic-sparkles"></i> AI Sound Master
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Production Studio Settings */}
        <div className="lg:col-span-7 space-y-8">
           <section className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800 shadow-2xl">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3 text-white">
                  <i className="fa-solid fa-clapperboard text-indigo-400"></i>
                  {language === 'ar' ? 'وصف المشهد السينمائي' : 'Cinematic Concept'}
                </h2>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Input Node 01</span>
             </div>
             <textarea 
               value={prompt} 
               onChange={e => setPrompt(e.target.value)} 
               className="w-full h-36 bg-slate-950/80 border border-slate-800 rounded-3xl p-6 focus:ring-2 focus:ring-indigo-600 outline-none transition-all mb-8 text-lg font-medium leading-relaxed placeholder:text-slate-700" 
               placeholder="Write your cinematic story here..." 
             />
             
             <div className="grid grid-cols-2 gap-8 text-start" dir="ltr">
                <div>
                   <label className="text-[10px] font-bold text-slate-500 uppercase block mb-3 tracking-widest">Output Format</label>
                   <div className="grid grid-cols-2 gap-2">
                      {['16:9', '9:16'].map(ratio => (
                        <button key={ratio} onClick={() => setAspectRatio(ratio as any)} className={`py-3 rounded-2xl border text-sm font-black transition-all ${aspectRatio === ratio ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'}`}>
                          {ratio}
                        </button>
                      ))}
                   </div>
                </div>
                <div>
                   <label className="text-[10px] font-bold text-slate-500 uppercase block mb-3 tracking-widest">Visual fidelity</label>
                   <div className="grid grid-cols-2 gap-2">
                      {['1080p', '720p'].map(res => (
                        <button key={res} onClick={() => setResolution(res as any)} className={`py-3 rounded-2xl border text-sm font-black transition-all ${resolution === res ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'}`}>
                          {res}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
           </section>

           {/* Pro Audio Mixer & Multi-Track Studio */}
           <section className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-bold flex items-center gap-3 text-white">
                  <i className="fa-solid fa-wave-square text-indigo-400"></i>
                  Multi-Track Production Studio
                </h2>
                <div className="flex items-center gap-2">
                   <div className="px-3 py-1 rounded-full bg-slate-800 text-[10px] font-black text-slate-400 border border-slate-700">ACTIVE CHANNELS: {audioLayers.length}</div>
                </div>
              </div>

              {audioLayers.length === 0 ? (
                <div className="text-center py-24 bg-slate-950/50 rounded-3xl border-2 border-dashed border-slate-800 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6 border border-slate-800">
                    <i className="fa-solid fa-music text-slate-700 text-3xl"></i>
                  </div>
                  <p className="text-slate-500 font-bold mb-2">No audio tracks identified.</p>
                  <p className="text-slate-700 text-xs">Browse the library or paste a Musopen link to start mixing.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {audioLayers.map((layer, idx) => (
                    <div key={layer.id} className="bg-slate-950/90 p-8 rounded-[2.5rem] border border-slate-800 relative animate-fadeIn group hover:border-indigo-500/30 transition-all shadow-xl">
                      {/* Track Header */}
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-2xl bg-indigo-600/10 text-indigo-400 text-xs flex items-center justify-center font-black border border-indigo-600/20 shadow-inner">0{idx+1}</span>
                            <div>
                               <h3 className="font-black text-white text-base tracking-tight">{layer.name}</h3>
                               <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">WAVEFORM SRC: {layer.trackId}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <button className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-600 hover:text-indigo-400 transition-all flex items-center justify-center">
                               <i className="fa-solid fa-volume-high text-xs"></i>
                            </button>
                            <button onClick={() => removeLayer(layer.id)} className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-600 hover:text-red-500 transition-all flex items-center justify-center">
                               <i className="fa-solid fa-trash-can text-xs"></i>
                            </button>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start" dir="ltr">
                        {/* Trim & Placement Column */}
                        <div className="md:col-span-8 space-y-8">
                           {/* Clip Trimming */}
                           <div>
                              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">
                                <span>1. File Trim (Source)</span>
                                <span className="text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">{layer.clipStart}s — {layer.clipEnd}s</span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                 <div>
                                    <label className="text-[9px] font-bold text-slate-700 block mb-2">IN-POINT</label>
                                    <input type="number" value={layer.clipStart} onChange={e => updateLayer(layer.id, { clipStart: parseFloat(e.target.value) })} className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs font-mono text-indigo-300 outline-none focus:border-indigo-500" />
                                 </div>
                                 <div>
                                    <label className="text-[9px] font-bold text-slate-700 block mb-2">OUT-POINT</label>
                                    <input type="number" value={layer.clipEnd} onChange={e => updateLayer(layer.id, { clipEnd: parseFloat(e.target.value) })} className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs font-mono text-indigo-300 outline-none focus:border-indigo-500" />
                                 </div>
                              </div>
                           </div>

                           {/* Timeline Placement */}
                           <div>
                              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">
                                <span>2. Video Timeline Offset</span>
                                <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">Starts @ {layer.timelineOffset}s</span>
                              </div>
                              <input 
                                type="range" min="0" max="120" step="1" 
                                value={layer.timelineOffset} 
                                onChange={e => updateLayer(layer.id, { timelineOffset: parseInt(e.target.value) })} 
                                className="w-full h-1.5 bg-slate-800 rounded-full accent-indigo-500 appearance-none cursor-pointer" 
                              />
                              <div className="flex justify-between mt-2 text-[9px] font-bold text-slate-700">
                                 <span>START OF VIDEO</span>
                                 <span>2 MIN MARK</span>
                              </div>
                           </div>
                           
                           {/* Master Gain */}
                           <div>
                              <label className="text-[10px] font-black text-slate-500 uppercase block mb-4 tracking-widest">3. Master Track Gain ({Math.round(layer.volume * 100)}%)</label>
                              <input type="range" min="0" max="1" step="0.01" value={layer.volume} onChange={e => updateLayer(layer.id, { volume: parseFloat(e.target.value) })} className="w-full h-1.5 bg-slate-800 rounded-full accent-emerald-500 appearance-none cursor-pointer" />
                           </div>
                        </div>

                        {/* Professional EQ Column */}
                        <div className="md:col-span-4 flex flex-col items-center justify-between border-l border-slate-800 pl-10 h-full">
                           <span className="text-[10px] font-black text-slate-500 uppercase mb-8 tracking-widest">Channel EQ</span>
                           <div className="flex justify-between w-full gap-4">
                              {['bass', 'mid', 'treble'].map(band => (
                                <div key={band} className="flex flex-col items-center flex-1">
                                   <div className="h-32 w-8 bg-slate-900/80 rounded-2xl relative flex flex-col justify-end p-1 border border-slate-800 shadow-inner group-hover:border-indigo-500/20 transition-all">
                                      <input 
                                        type="range" min="-15" max="15" 
                                        value={layer.eq[band as keyof typeof layer.eq]} 
                                        onChange={e => updateLayer(layer.id, { eq: { ...layer.eq, [band]: parseInt(e.target.value) } })}
                                        className="absolute h-24 w-1 bottom-4 left-1/2 -translate-x-1/2 accent-indigo-400 appearance-none bg-slate-800 rounded-full cursor-ns-resize"
                                        style={{ writingMode: 'vertical-lr' as any, direction: 'rtl' }}
                                      />
                                   </div>
                                   <span className="text-[10px] mt-4 font-black text-slate-400 uppercase tracking-tighter">{band}</span>
                                   <span className="text-[10px] font-mono text-indigo-400/70">{layer.eq[band as keyof typeof layer.eq]}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-6 border-t border-slate-800 text-center">
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">Mix Strategy: {audioLayers.length > 1 ? 'Dynamic Layering' : 'Single Channel Master'}</p>
                  </div>
                </div>
              )}
           </section>
        </div>

        {/* Cinematic Preview & Execution */}
        <div className="lg:col-span-5">
           <div className="sticky top-24 space-y-8">
              <div className="aspect-video lg:aspect-square bg-slate-950 rounded-[3.5rem] border border-slate-800 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden relative border-gradient transition-all">
                 {isGenerating ? (
                   <div className="text-center p-12 w-full animate-pulse">
                      <div className="relative w-32 h-32 mx-auto mb-10">
                         <div className="absolute inset-0 border-8 border-indigo-600/10 rounded-full"></div>
                         <div className="absolute inset-0 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                         <div className="absolute inset-4 border-4 border-emerald-500/20 rounded-full border-b-transparent animate-spin duration-700"></div>
                      </div>
                      <h3 className="text-2xl font-black mb-2 text-white tracking-tight">Veo 3.1 Neural Engine</h3>
                      <p className="text-indigo-400 font-mono text-[10px] uppercase font-bold tracking-[0.5em]">{statusMessage}</p>
                   </div>
                 ) : resultUri ? (
                   <video src={resultUri} controls autoPlay loop className="w-full h-full object-contain" />
                 ) : (
                   <div className="text-center p-10 group cursor-default">
                      <div className="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-800 group-hover:scale-110 transition-transform duration-500">
                        <i className="fa-solid fa-play text-indigo-400 text-4xl ml-2"></i>
                      </div>
                      <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-700">Production Pipeline Idle</p>
                      <p className="text-[10px] text-slate-800 mt-4 font-bold">READY TO BAKE MASTERPIECE</p>
                   </div>
                 )}
              </div>

              {error && (
                <div className="p-5 rounded-3xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs text-center font-bold animate-fadeIn">
                   <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
                </div>
              )}

              <div className="space-y-4">
                <button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="w-full py-7 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 disabled:text-slate-700 rounded-[2.5rem] font-black text-2xl text-white shadow-[0_30px_60px_rgba(79,70,229,0.3)] transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-4 group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                  {isGenerating ? <i className="fa-solid fa-gear fa-spin"></i> : <i className="fa-solid fa-rocket text-xl group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"></i>}
                  {language === 'ar' ? 'بدء التصوير والإنتاج' : 'Initiate Render'}
                </button>
                
                <div className="flex justify-between px-8 text-[9px] text-slate-700 font-black uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Gemini Live
                  </div>
                  <span>High Latency Production</span>
                </div>
              </div>
           </div>
        </div>
      </div>
      
      <style>{`
        .border-gradient { border: 2px solid transparent; background-image: linear-gradient(rgba(2, 6, 23, 1), rgba(2, 6, 23, 1)), linear-gradient(to right, #4f46e5, #9333ea, #10b981); background-origin: border-box; background-clip: padding-box, border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
      `}</style>
    </div>
  );
};

export default CreateVideo;
