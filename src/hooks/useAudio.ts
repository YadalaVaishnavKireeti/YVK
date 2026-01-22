import { useRef, useState, useCallback } from "react";

export const useAudio = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [soundOn, setSoundOn] = useState(false);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const tone = useCallback((freq: number, dur = 0.15, vol = 0.2) => {
    if (!soundOn || !audioCtxRef.current) return;
    
    const o = audioCtxRef.current.createOscillator();
    const g = audioCtxRef.current.createGain();
    o.frequency.value = freq;
    g.gain.value = vol;
    g.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + dur);
    o.connect(g).connect(audioCtxRef.current.destination);
    o.start();
    o.stop(audioCtxRef.current.currentTime + dur);
  }, [soundOn]);

  const collectSound = useCallback(() => tone(520, 0.12, 0.15), [tone]);
  const milestoneSound = useCallback(() => tone(880, 0.25, 0.25), [tone]);
  
  const celebrationSound = useCallback(() => {
    [523, 659, 784, 1046].forEach((f, i) => {
      setTimeout(() => tone(f, 0.3, 0.18), i * 120);
    });
  }, [tone]);

  const enableSound = useCallback(() => {
    const ctx = initAudio();
    ctx.resume();
    setSoundOn(true);
  }, [initAudio]);

  const toggleSound = useCallback(() => {
    if (!soundOn) {
      enableSound();
    } else {
      setSoundOn(false);
    }
  }, [soundOn, enableSound]);

  return {
    soundOn,
    setSoundOn,
    enableSound,
    toggleSound,
    collectSound,
    milestoneSound,
    celebrationSound,
  };
};
