import { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundToggleProps {
  onToggle: (enabled: boolean) => void;
}

// Check if device is touch/mobile
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
};

export function SoundToggle({ onToggle }: SoundToggleProps) {
  const [enabled, setEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setIsMobile(isTouchDevice());
    
    // Check local storage for saved preference
    const saved = localStorage.getItem('sunrise-sound-enabled');
    if (saved === 'true' && !isTouchDevice()) {
      setEnabled(true);
      onToggle(true);
    }
  }, [onToggle]);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = ctx;
    }
    return audioContextRef.current;
  }, []);

  const playChirp = useCallback(() => {
    const ctx = initAudio();
    if (!ctx) return;
    
    // Resume context if suspended (browser policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const chirp = () => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Softer, more natural bird chirp
      const baseFreq = 2200 + Math.random() * 600;
      oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, ctx.currentTime + 0.04);
      oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, ctx.currentTime + 0.08);
      
      gainNode.gain.setValueAtTime(0.04 + Math.random() * 0.03, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + 0.1);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    };
    
    // Gentle double chirp
    chirp();
    setTimeout(chirp, 100);
  }, [initAudio]);

  const toggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    onToggle(newEnabled);
    localStorage.setItem('sunrise-sound-enabled', String(newEnabled));
    
    if (newEnabled) {
      initAudio();
      // Play a gentle test chirp after a short delay
      setTimeout(() => playChirp(), 150);
    }
  };

  // Hide on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-6 right-6 z-[100] w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
        enabled 
          ? 'bg-sunrise-accent text-white' 
          : 'bg-white/80 backdrop-blur-sm text-sunrise-text-secondary hover:bg-white'
      }`}
      style={{ 
        boxShadow: enabled 
          ? '0 4px 16px rgba(216, 163, 74, 0.35)' 
          : '0 4px 12px rgba(0,0,0,0.1)'
      }}
      aria-label={enabled ? 'Mute bird sounds' : 'Enable bird sounds'}
      title={enabled ? 'Bird sounds on' : 'Bird sounds off'}
    >
      {enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </button>
  );
}

// Hook to manage bird chirping sounds
export function useBirdSounds(enabled: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Don't run on mobile
    if (isTouchDevice()) return;

    if (enabled && !audioContextRef.current) {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = ctx;
    }
  }, [enabled]);

  useEffect(() => {
    // Don't run on mobile
    if (isTouchDevice()) return;
    if (!enabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;

    const playChirp = () => {
      // Resume context if suspended
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const chirp = () => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        // Varied, gentle chirp patterns
        const baseFreq = 2000 + Math.random() * 800;
        oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, ctx.currentTime + 0.03);
        oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, ctx.currentTime + 0.07);
        
        gainNode.gain.setValueAtTime(0.03 + Math.random() * 0.03, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + 0.08);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.08);
      };
      
      // Random number of chirps (1-2 for gentler experience)
      const chirpCount = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < chirpCount; i++) {
        setTimeout(chirp, i * (90 + Math.random() * 50));
      }
    };

    // Schedule random chirps with longer intervals (4-10 seconds)
    const scheduleChirp = () => {
      const delay = 4000 + Math.random() * 6000;
      timeoutRef.current = setTimeout(() => {
        if (enabled) {
          playChirp();
          scheduleChirp();
        }
      }, delay);
    };

    scheduleChirp();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled]);
}
