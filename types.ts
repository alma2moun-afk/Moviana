
export enum AppView {
  LANDING = 'landing',
  DASHBOARD = 'dashboard',
  CREATE = 'create',
  GALLERY = 'gallery',
  LIBRARY = 'library',
  PRICING = 'pricing'
}

export interface AudioLayer {
  id: string;
  trackId: string;
  name: string;
  url: string;
  clipStart: number; // seconds from start of file
  clipEnd: number;   // seconds from start of file
  timelineOffset: number; // seconds from start of video
  volume: number;
  eq: {
    bass: number;
    mid: number;
    treble: number;
  };
}

export interface GeneratedVideo {
  id: string;
  prompt: string;
  uri: string;
  timestamp: number;
  status: 'completed' | 'processing' | 'failed';
  aspectRatio: '16:9' | '9:16';
  thumbnail?: string;
}

export interface VideoConfig {
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
  image?: string;
  voiceId?: string;
  language?: string;
  audioLayers: AudioLayer[];
}
