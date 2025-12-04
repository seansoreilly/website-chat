import React, { useState, useEffect, useRef } from 'react';
import Waveform from './Waveform';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isProcessing: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setError("Microphone error. Please type.");
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError("Browser doesn't support speech recognition.");
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (isProcessing) return;
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setError(null);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
       {isListening ? (
         <div className="flex flex-col items-center animate-pulse">
            <span className="text-cyan-400 text-sm font-semibold mb-2">Listening...</span>
            <Waveform isActive={true} />
         </div>
       ) : (
         <div className="h-12 flex items-center justify-center">
            {isProcessing && <Waveform isActive={true} />}
         </div>
       )}
      
      <button
        onClick={toggleListening}
        disabled={isProcessing || !!error}
        className={`
          rounded-full p-6 transition-all duration-300 shadow-lg border-2
          ${isListening 
            ? 'bg-red-500/20 border-red-500 text-red-500 scale-110 shadow-red-500/50' 
            : 'bg-cyan-500/20 border-cyan-500 text-cyan-400 hover:bg-cyan-500/30 hover:scale-105 shadow-cyan-500/30'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed grayscale' : ''}
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" x2="12" y1="19" y2="22"/>
        </svg>
      </button>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default VoiceInput;
