"use client";

import { useEffect, useState } from "react";

import { detectCitation } from "@/actions/detectCitation";
import { useSettings } from "@/hooks/useSettings";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import type { Citation, DetectionResult, StatusType } from "@/types";
import Loader from "../Loader";
import MicControls from "../MicControls";
import Status from "../Status";
import Transcription from "../Transcription";
import CitationCard from "./CitationCard";
import CitationsHistory from "./CitationsHistory";

export default function CitationDetector() {
  const { apiKey, model } = useSettings();

  const [status, setStatus] = useState<StatusType>("default");
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [citationsHistory, setCitationsHistory] = useState<Citation[]>([]);

  const {
    isListening,
    transcript,
    finalTranscript,
    start,
    stop,
    resetFinalTranscript,
  } = useSpeechRecognition();
  // Detect mobile to avoid infinite loops
  const isMobile =
    typeof navigator !== "undefined" &&
    /Mobi|Android/i.test(navigator.userAgent);

  // Citation detection on finalTranscript
  useEffect(() => {
    if (!finalTranscript) return;
    const runDetect = async () => {
      setErrorMessage(null);
      try {
        setLoader(true);
        setCitations([]);
        setStatus("searching");

        const res = (await detectCitation({
          text: finalTranscript,
          model,
          apiKey: apiKey || undefined,
        })) as DetectionResult;
        // Gestion des erreurs API inattendues
        if (res.error) {
          console.error("Erreur API détectée :", res.error);
          setLoader(false);
          setStatus("error");
          setErrorMessage(res.error);
          resetFinalTranscript();
          return;
        }

        setLoader(false);

        let citationsToShow: Citation[] = [];
        if (
          res?.citationTrouvee &&
          Array.isArray(res.citations) &&
          res.citations.length > 0
        ) {
          // Afficher toutes les citations détectées
          citationsToShow = res.citations;
        } else if (
          res?.citationTrouvee &&
          res.citation &&
          res.auteur &&
          res.source &&
          res.date
        ) {
          citationsToShow = [
            {
              citation: res.citation,
              auteur: res.auteur,
              source: res.source,
              date: res.date,
            },
          ];
        }

        setCitations(citationsToShow);
        if (citationsToShow.length > 0) {
          setStatus("found");
          setCitationsHistory((prev) => [...citationsToShow, ...prev]);
        } else if (res?.citationTrouvee === false) {
          setStatus("notfound");
        } else {
          console.error("Résultat inattendu :", res);
          setStatus("error");
        }
        resetFinalTranscript();
        // Automatic restart (desktop only)
        if (
          !isMobile &&
          (citationsToShow.length > 0 || res?.citationTrouvee === false)
        ) {
          // Après un court délai, repasser en mode écoute
          setTimeout(() => {
            setStatus("listening");
            if (!isListening) {
              start();
            }
          }, 2000);
        }
        // On mobile, stop listening after detection to prevent infinite loops
        if (isMobile) {
          stop();
        }
      } catch (error: unknown) {
        console.error("Erreur de détection de citation :", error);
        const message = error instanceof Error ? error.message : String(error);
        setLoader(false);
        setStatus("error");
        setErrorMessage(message);
        resetFinalTranscript();
      }
    };
    if (isMobile) {
      const timer = setTimeout(runDetect, 1500);
      return () => clearTimeout(timer);
    } else {
      runDetect();
    }
  }, [finalTranscript, isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stop listening when component unmounts
  useEffect(() => {
    return () => {
      if (isListening) {
        stop();
        setStatus("default");
      }
    };
  }, [isListening, stop]);

  // Stop microphone when tab is inactive or app goes to background
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden" && isListening) {
        stop();
        setStatus("default");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isListening, stop]);

  // Stop microphone after 20 seconds if no detection
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isListening) {
      timeout = setTimeout(() => {
        stop();
        setStatus("default");
      }, 20000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isListening, stop]);

  const handleMicClick = () => {
    if (isListening) {
      stop();
      setStatus("default");
    } else {
      setStatus("listening");
      start();
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-3 sm:space-y-6">
      {/* Transcription */}
      <Transcription text={transcript} />

      {/* Loader */}
      <Loader show={loader} />

      {/* Status */}
      <Status statusType={status} />
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}

      {/* Detected citation(s) */}
      {citations.map((citation, i) => (
        <CitationCard
          key={i}
          citation={citation}
        />
      ))}

      {/* History */}
      <CitationsHistory citations={citationsHistory} />

      {/* Microphone controls */}
      <MicControls
        isListening={isListening}
        onMicClick={handleMicClick}
      />
    </div>
  );
}
