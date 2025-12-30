
import React, { useState, useRef, useEffect } from 'react';
import { libraryImages, videoTemplates, voices, categories, languages, musicLibrary, musicCategories } from '../data/assets';
import { generateVoicePreview } from '../services/geminiService';

interface LibraryProps {
  onUseAsset: (data: any) => void;
}

const Library: React.FC<LibraryProps> = ({ onUseAsset }) => {
  const [activeTab, setActiveTab] = useState<'images' | 'templates' | 'voices' | 'music'>('images');
  const [filter, setFilter] = useState('All');
  const [selectedLanguage] = useState(languages[0]);
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const [playingMusic, setPlayingMusic] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Persistent audio player instance
    const audio = new Audio();
    audio.preload = "auto";
    audioPlayerRef.current = audio;

    const handlePlaying = () => setIsLoadingAudio(false);
    const handleWaiting = () => setIsLoadingAudio(true);
    const handleEnded = () => {
      setPlayingMusic(null);
      setIsLoadingAudio(false);
    };
    const handleError = (e: any) => {
      console.error("Audio Load Error:", e);
      setIsLoadingAudio(false);
      setPlayingMusic(null);
    };

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const playMusic = (m: any) => {
    const player = audioPlayerRef.current;
    if (!player) return;

    if (playingMusic === m.id) {
      player.pause();
      setPlayingMusic(null);
    } else {
      setIsLoadingAudio(true);
      setPlayingMusic(m.id);
      player.src = m.url;
      player.load();
      player.play().catch(err => {
        console.error("Playback error:", err);
        setPlayingMusic(null);
        setIsLoadingAudio(false);
      });
    }
  };

  const playVoiceSample = async (v: any) => {
    if (previewingVoice) return;
    setPreviewingVoice(v.id);
    try {
      const base64 = await generateVoicePreview(selectedLanguage.greeting, v.prebuiltName);
      if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const dataInt16 = new Int16Array(bytes.buffer);
      const audioBuffer = ctx.createBuffer(1, dataInt16.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setPreviewingVoice(null);
      source.start();
    } catch (err) {
      setPreviewingVoice(null);
    }
  };

  const isRTL = selectedLanguage.code === 'ar';
  const filteredImages = filter === 'All' ? libraryImages : libraryImages.filter(img => img.category === filter);
  const filteredMusic = filter === 'All' ? musicLibrary : musicLibrary.filter(m => m.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className={`mb-12 text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
        <h1 className="text-4xl font-black mb-3 text-white tracking-tight">
          {isRTL ? 'مكتبة الإنتاج الإبداعي' : 'Creative Production Library'}
        </h1>
        <p className="text-slate-400 text-lg">
          {isRTL ? 'أصول سينمائية مختارة لدعم مشاريعك الاحترافية.' : 'Premium assets to power your professional projects.'}
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4 mb-10 border-b border-slate-800 pb-6">
        {[
          { id: 'images', label: isRTL ? 'الصور' : 'Visuals', icon: 'fa-image' },
          { id: 'templates', label: isRTL ? 'القوالب' : 'Templates', icon: 'fa-film' },
          { id: 'music', label: isRTL ? 'الموسيقى' : 'Audio', icon: 'fa-music' },
          { id: 'voices', label: isRTL ? 'الأصوات' : 'Voices', icon: 'fa-microphone' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setFilter('All'); }}
            className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-3 border ${
              activeTab === tab.id 
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/30' 
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[50vh]">
        {activeTab === 'images' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredImages.map(img => (
              <div key={img.id} className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 aspect-square">
                <img src={img.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onUseAsset({ image: img.url, prompt: img.prompt })} className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                    {isRTL ? 'استخدام' : 'Use'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'music' && (
          <div className="space-y-4">
            {filteredMusic.map(m => (
              <div key={m.id} className={`flex items-center justify-between p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/30 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button onClick={() => playMusic(m)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${playingMusic === m.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-indigo-600'}`}>
                    {playingMusic === m.id && isLoadingAudio ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className={`fa-solid ${playingMusic === m.id ? 'fa-pause' : 'fa-play'}`}></i>}
                  </button>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h4 className="font-bold text-lg text-white">{m.title}</h4>
                    <p className="text-xs text-slate-500 uppercase">{m.category} • {m.artist}</p>
                  </div>
                </div>
                <button onClick={() => onUseAsset({ audioLayer: { trackId: m.id, name: m.title, url: m.url, duration: m.duration } })} className="px-6 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold border border-slate-700 hover:bg-indigo-600 transition-colors">
                  {isRTL ? 'إضافة للمشروع' : 'Add to Project'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videoTemplates.map(tpl => (
              <div key={tpl.id} className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden group">
                <div className="aspect-video relative bg-black">
                  <video src={tpl.videoUrl} className="w-full h-full object-cover" muted loop onMouseOver={e => e.currentTarget.play()} onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }} />
                </div>
                <div className={`p-6 ${isRTL ? 'text-right' : ''}`}>
                  <h3 className="text-xl font-bold mb-2 text-white">{tpl.title}</h3>
                  <button onClick={() => onUseAsset({ prompt: tpl.basePrompt })} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20">
                    {isRTL ? 'تخصيص القالب' : 'Use Template'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'voices' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {voices.female.concat(voices.male).map(v => (
              <div key={v.id} className={`flex items-center justify-between p-6 rounded-3xl bg-slate-900/50 border border-slate-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button onClick={() => playVoiceSample(v)} className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 transition-all">
                    <i className={`fa-solid ${previewingVoice === v.id ? 'fa-spinner fa-spin' : 'fa-microphone'}`}></i>
                  </button>
                  <div className={isRTL ? 'text-right' : ''}>
                    <span className="font-bold text-white block">{v.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{v.style}</span>
                  </div>
                </div>
                <button onClick={() => onUseAsset({ voiceId: v.id, voiceName: v.name })} className="px-6 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold border border-slate-700">
                  {isRTL ? 'اختيار' : 'Select'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .grid > div { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Library;
