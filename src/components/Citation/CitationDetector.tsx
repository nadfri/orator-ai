'use client';

import { useState } from 'react';
import MicControls from '../MicControls';
import Transcription from '../Transcription';
import CitationCard from './CitationCard';
import CitationsHistory from './CitationsHistory';
import Loader from '../Loader';
import Status from '../Status';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { detectCitation } from '../../actions/detectCitation';
import { useSettings } from '../../hooks/useSettings';
import type { Citation, DetectionResult } from '../../types';

export default function CitationDetector() {
  const { apiKey, model } = useSettings();
  const [status, setStatus] = useState<{ message: string; color?: string }>({
    message: 'Cliquez sur le micro pour commencer',
    color: 'gray',
  });
  const [loader, setLoader] = useState(false);
  const [citation, setCitation] = useState<Citation | null>(null);
  const [citationsHistory, setCitationsHistory] = useState<Citation[]>([]);

  const { isListening, transcript, start, stop } = useSpeechRecognition(
    async (finalText: string) => {
      setLoader(true);
      setCitation(null);
      setStatus({ message: 'Recherche de citation...', color: 'yellow' });

      const res = (await detectCitation({
        text: finalText,
        model,
        apiKey: apiKey || undefined,
      })) as DetectionResult;

      setLoader(false);

      if (res?.citationTrouvee && res.citation && res.auteur && res.source && res.date) {
        const newCitation: Citation = {
          citation: res.citation,
          auteur: res.auteur,
          source: res.source,
          date: res.date,
        };
        setCitation(newCitation);
        setStatus({ message: 'Citation trouvée !', color: 'green' });
        setCitationsHistory((prev) => [newCitation, ...prev]);
      } else if (res?.citationTrouvee === false) {
        setCitation(null);
        setStatus({
          message: 'Aucune citation détectée dans la dernière phrase.',
          color: 'gray',
        });
      } else {
        setCitation(null);
        setStatus({ message: res?.error || 'Erreur inattendue.', color: 'red' });
      }
    }
  );

  return (
    <div className='w-full flex flex-col items-center space-y-3 sm:space-y-6'>
      {/* Contrôles micro */}
      <MicControls
        isListening={isListening}
        onMicClick={() => (isListening ? stop() : start())}
      />

      {/* Transcription */}
      <Transcription text={transcript} />

      {/* Loader */}
      <Loader show={loader} />

      {/* Status */}
      <Status message={status.message} color={status.color as any} />

      {/* Citation détectée */}
      <CitationCard
        citation={citation?.citation || ''}
        auteur={citation?.auteur || ''}
        source={citation?.source || ''}
        date={citation?.date || ''}
        show={!!citation}
      />

      {/* Historique */}
      <CitationsHistory citations={citationsHistory} />
    </div>
  );
}
