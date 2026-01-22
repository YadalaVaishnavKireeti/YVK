import { useState, useCallback } from 'react';
import AudioPrompt from '@/components/AudioPrompt';
import SoundToggle from '@/components/SoundToggle';
import Toast from '@/components/Toast';
import GameCanvas from '@/components/GameCanvas';
import { useAudio } from '@/hooks/useAudio';

const TOTAL = 12;

const Index = () => {
  const [showPrompt, setShowPrompt] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [eatenCount, setEatenCount] = useState(0);
  const [halfShown, setHalfShown] = useState(false);
  const [finished, setFinished] = useState(false);

  const {
    soundOn,
    setSoundOn,
    enableSound,
    toggleSound,
    collectSound,
    milestoneSound,
    celebrationSound,
  } = useAudio();

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    milestoneSound();
    setTimeout(() => setToastVisible(false), 1300);
  }, [milestoneSound]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    showToast("COLLECT ALL PARTICLES");
  }, [showToast]);

  const handleAudioYes = useCallback(() => {
    enableSound();
    setShowPrompt(false);
    startGame();
  }, [enableSound, startGame]);

  const handleAudioNo = useCallback(() => {
    setSoundOn(false);
    setShowPrompt(false);
    startGame();
  }, [setSoundOn, startGame]);

  const handleCollect = useCallback(() => {
    setEatenCount((prev) => prev + 1);
    collectSound();
  }, [collectSound]);

  const handleHalfway = useCallback(() => {
    setHalfShown(true);
    showToast("50% MORE TO GO");
  }, [showToast]);

  const handleComplete = useCallback(() => {
    setFinished(true);
    celebrationSound();
  }, [celebrationSound]);

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans bg-white">
      {showPrompt && (
        <AudioPrompt onYes={handleAudioYes} onNo={handleAudioNo} />
      )}
      
      <SoundToggle soundOn={soundOn} onClick={toggleSound} />
      
      <GameCanvas
        gameStarted={gameStarted}
        onCollect={handleCollect}
        onHalfway={handleHalfway}
        onComplete={handleComplete}
        eatenCount={eatenCount}
        halfShown={halfShown}
        finished={finished}
      />
      
      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
};

export default Index;
