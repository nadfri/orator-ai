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

  // Citation detection on finalTranscript
  useEffect(() => {
    if (!finalTranscript) return;
    const detect = async () => {
      setLoader(true);
      setCitations([]);
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
        citationsToShow = res.citations.slice(0, 2); // Take the first 2
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
  }, [finalTranscript]); // eslint-disable-line react-hooks/exhaustive-deps

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
