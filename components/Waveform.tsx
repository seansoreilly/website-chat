import React, { useEffect, useState } from 'react';

interface WaveformProps {
  isActive: boolean;
}

const Waveform: React.FC<WaveformProps> = ({ isActive }) => {
  const [bars, setBars] = useState<number[]>(new Array(5).fill(10));

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setBars(prev => prev.map(() => Math.floor(Math.random() * 30) + 10));
      }, 100);
    } else {
      setBars(new Array(5).fill(5));
    }
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-1.5 bg-cyan-400 rounded-full visualizer-bar"
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
};

export default Waveform;