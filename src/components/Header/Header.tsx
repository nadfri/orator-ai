'use client';
import { useState } from 'react';
import { Settings } from 'lucide-react';
import SettingsPanel from './SettingsPanel';
import { useSettings } from '../../hooks/useSettings';

export default function Header() {
  const { showSettings, openSettings, closeSettings } = useSettings();
  const [notification, setNotification] = useState<{ message: string; color?: string }>({
    message: '',
    color: 'gray',
  });

  const showNotification = (
    message: string,
    color: string = 'gray',
    duration: number = 2000
  ) => {
    setNotification({ message, color });
    if (duration > 0) {
      setTimeout(() => setNotification({ message: '', color: 'gray' }), duration);
    }
  };

  return (
    <header className='w-full max-w-3xl flex flex-col items-center space-y-3 sm:space-y-6 sm:px-4 relative'>
      <h1 className='font-[poppins] text-3xl sm:text-4xl font-extrabold text-blue-300 mt-2 mb-1 text-center tracking-tight drop-shadow-sm'>
        Orator AI
      </h1>
      <p className='text-center text-gray-300 mb-3 sm:mb-6 max-w-md text-base sm:text-lg leading-snug'>
        Votre assistant intelligent pour détecter les citations célèbres
      </p>
      {/* Bouton paramètres */}
      <div className='absolute top-2 right-0 z-30 flex items-center justify-center'>
        <button
          className='flex items-center justify-center text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg'
          aria-label='Ouvrir les paramètres'
          onClick={openSettings}>
          <Settings className='w-7 h-7 sm:w-8 sm:h-8' strokeWidth={2.2} />
        </button>
      </div>
      {/* Overlay et panneau de paramètres */}
      {showSettings && (
        <>
          <div
            className='fixed inset-0 bg-black opacity-50 z-40'
            onClick={closeSettings}
          />
          <SettingsPanel
            onClose={closeSettings}
            show={showSettings}
            showNotification={showNotification}
          />
        </>
      )}
      {/* Notification */}
      {notification.message && (
        <div
          className={`fixed bottom-4 right-4 p-3 rounded-md text-white ${
            notification.color === 'green' ? 'bg-green-600' : 'bg-red-600'
          }`}>
          {notification.message}
        </div>
      )}
    </header>
  );
}
