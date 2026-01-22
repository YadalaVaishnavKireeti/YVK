interface SoundToggleProps {
  soundOn: boolean;
  onClick: () => void;
}

const SoundToggle = ({ soundOn, onClick }: SoundToggleProps) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 text-2xl cursor-pointer z-10 bg-transparent border-none"
      aria-label={soundOn ? "Mute sound" : "Enable sound"}
    >
      {soundOn ? "🔊" : "🔇"}
    </button>
  );
};

export default SoundToggle;
