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
  const [citation, setCitation] = useState<Citation | Citation[] | null>(null);
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

      let citationsToShow: Citation[] = [];
      if (
        res?.citationTrouvee &&
        Array.isArray(res.citations) &&
        res.citations.length > 0
      ) {
        citationsToShow = res.citations.slice(0, 2); // On prend les 2 premières
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

      if (citationsToShow.length > 0) {
        setCitation(citationsToShow);
        setStatus("found");
        setCitationsHistory((prev) => [...citationsToShow, ...prev]);
      } else if (res?.citationTrouvee === false) {
        setCitation(null);
        setStatus("notfound");
      } else {
        setCitation(null);
        setStatus("error");
      }
      resetFinalTranscript();
      // Après un court délai, repasser en mode écoute
      setTimeout(() => {
        setStatus("listening");
        if (!isListening) start();
      }, 1200);
    };

    detect();
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
      {/* Transcription */}
      <Transcription text={transcript} />

      {/* Loader */}
      <Loader show={loader} />

      {/* Status */}
      <Status statusType={status} />

      {/* Detected citation(s) */}
      {Array.isArray(citation) && citation.length > 0
        ? citation.map((c, i) => (
            <CitationCard
              key={i}
              citation={c}
            />
          ))
        : citation &&
          !Array.isArray(citation) && <CitationCard citation={citation} />}

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
