"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Keep the value up-to-date even inside callbacks
  const isListeningRef = useRef(isListening);
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

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
        setFinalTranscript(final.trim());
      }
    };

    recognitionRef.current.onend = () => {
      // Always restart if isListening is true (latest value)
      if (isListeningRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Ignore if already started
        }
      }
    };
    return () => {
      recognitionRef.current && recognitionRef.current.stop();
    };
  }, []); // Do not depend on isListening here, we use isListeningRef

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch (e) {
      // Ignore if already started
    }
  }, []);

  const stop = useCallback(() => {
    setIsListening(false);
    recognitionRef.current && recognitionRef.current.stop();
  }, []);

  const resetFinalTranscript = useCallback(() => {
    setFinalTranscript(null);
  }, []);

  return {
    isListening,
    transcript,
    finalTranscript,
    start,
    stop,
    resetFinalTranscript,
  };
}
