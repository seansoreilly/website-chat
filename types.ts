export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isAudioPlaying?: boolean;
  groundingSources?: GroundingSource[];
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export enum AppState {
  IDLE = 'IDLE',
  SCRAPING = 'SCRAPING',
  CHATTING = 'CHATTING',
}

export interface ScrapedData {
  url: string;
  content: string;
  title: string;
  success: boolean;
}