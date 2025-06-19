"use client";

import { useEffect, useRef, useState } from "react";

export function useSpeechRecognition(
  onFinalTranscript: (text: string) => void
) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "fr-FR";
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setTranscript(final + interim);

      if (final.trim().length > 5) {
        onFinalTranscript(final.trim());
      }
    };

    recognitionRef.current.onend = () => {
      if (isListening && recognitionRef.current) recognitionRef.current.start();
    };
    
    return () => {
      recognitionRef.current && recognitionRef.current.stop();
    };
  }, []);

  const start = () => {
    if (!recognitionRef.current) return;
    setIsListening(true);
    recognitionRef.current.start();
  };
  const stop = () => {
    setIsListening(false);
    recognitionRef.current && recognitionRef.current.stop();
  };

  return { isListening, transcript, start, stop };
}
