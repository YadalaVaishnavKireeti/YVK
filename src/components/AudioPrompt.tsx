interface AudioPromptProps {
  onYes: () => void;
  onNo: () => void;
}

const AudioPrompt = ({ onYes, onNo }: AudioPromptProps) => {
  return (
    <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-20">
      <div className="border-2 border-black p-6 text-center bg-white">
        <p className="font-semibold mb-4">Enable sound for a better experience?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onYes}
            className="px-4 py-1.5 font-semibold border-2 border-black bg-white hover:bg-gray-100 cursor-pointer transition-colors"
          >
            Yes
          </button>
          <button
            onClick={onNo}
            className="px-4 py-1.5 font-semibold border-2 border-black bg-white hover:bg-gray-100 cursor-pointer transition-colors"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPrompt;
