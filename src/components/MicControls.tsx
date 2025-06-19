import { Mic, Square } from 'lucide-react';

interface MicControlsProps {
  isListening: boolean;
  onMicClick: () => void;
}

export default function MicControls({ isListening, onMicClick }: MicControlsProps) {
  return (
    <div className='flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 sticky top-0 bg-gray-900 bg-opacity-90 backdrop-blur-md py-4 z-30 w-full rounded-b-xl mb-4'>
      <button
        onClick={onMicClick}
        className={`mic-button ${
          isListening
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-gradient-to-br from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500'
        } text-white p-4 sm:p-5 rounded-full shadow-lg focus:outline-none border-4 border-white dark:border-gray-800 transition-all duration-200 flex items-center justify-center`}
        aria-label={isListening ? "Arrêter l'écoute" : "Démarrer l'écoute"}>
        {' '}
        {isListening ? (
          <Square className='size-6' />
        ) : (
          <Mic className='size-6' />
        )}
      </button>
    </div>
  );
}
