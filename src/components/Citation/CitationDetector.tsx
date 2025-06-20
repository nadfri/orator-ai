"use client";

import { useEffect, useState } from "react";

import { detectCitation } from "@/actions/detectCitation";
import { useSettings } from "@/hooks/useSettings";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import Loader from "../Loader";
import MicControls from "../MicControls";
import Status from "../Status";
import Transcription from "../Transcription";
import CitationCard from "./CitationCard";
import CitationsHistory from "./CitationsHistory";
import type { Citation, DetectionResult, StatusType } from "@/types";

export default function CitationDetector() {
  const { apiKey, model } = useSettings();

  const [status, setStatus] = useState<StatusType>("default");
  const [loader, setLoader] = useState(false);
  const [citation, setCitation] = useState<Citation | null>(null);
  const [citationsHistory, setCitationsHistory] = useState<Citation[]>([]);

  const {
    isListening,
    transcript,
    finalTranscript,
    start,
    stop,
    resetFinalTranscript,
  } = useSpeechRecognition();

  // Citation detection on finalTranscript
  useEffect(() => {
    if (!finalTranscript) return;
    const detect = async () => {
      setLoader(true);
      setCitation(null);
      setStatus("searching");

      const res = (await detectCitation({
        text: finalTranscript,
        model,
        apiKey: apiKey || undefined,
      })) as DetectionResult;

      setLoader(false);

      if (
        res?.citationTrouvee &&
        res.citation &&
        res.auteur &&
        res.source &&
        res.date
      ) {
        const newCitation: Citation = {
          citation: res.citation,
          auteur: res.auteur,
          source: res.source,
          date: res.date,
        };

        setCitation(newCitation);
        setStatus("found");

        setCitationsHistory((prev) => [newCitation, ...prev]);
      } else if (res?.citationTrouvee === false) {
        setCitation(null);
        setStatus("notfound");
      } else {
        setCitation(null);
        setStatus("error");
      }
      resetFinalTranscript();
    };

    detect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTranscript]);

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
      {/* Microphone controls */}
      <MicControls
        isListening={isListening}
        onMicClick={handleMicClick}
      />

      {/* Transcription */}
      <Transcription text={transcript} />

      {/* Loader */}
      <Loader show={loader} />

      {/* Status */}
      <Status statusType={status} />

      {/* Detected citation */}
      {citation && <CitationCard citation={citation} />}

      {/* History */}
      <CitationsHistory citations={citationsHistory} />
    </div>
  );
}
