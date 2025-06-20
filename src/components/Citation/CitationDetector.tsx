"use client";

import { useState } from "react";

import { detectCitation } from "../../actions/detectCitation";
import { useSettings } from "../../hooks/useSettings";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import type { Citation, DetectionResult, StatusType } from "../../types";
import Loader from "../Loader";
import MicControls from "../MicControls";
import Status from "../Status";
import Transcription from "../Transcription";
import CitationCard from "./CitationCard";
import CitationsHistory from "./CitationsHistory";

export default function CitationDetector() {
  const { apiKey, model } = useSettings();
  
  const [status, setStatus] = useState<StatusType>("default");
  const [customStatusMessage, setCustomStatusMessage] = useState<
    string | undefined
  >(undefined);
  const [loader, setLoader] = useState(false);
  const [citation, setCitation] = useState<Citation | null>(null);
  const [citationsHistory, setCitationsHistory] = useState<Citation[]>([]);

  const { isListening, transcript, start, stop } = useSpeechRecognition(
    async (finalText: string) => {
      setLoader(true);
      setCitation(null);
      setStatus("searching");
      setCustomStatusMessage(undefined);
      const res = (await detectCitation({
        text: finalText,
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
        setCustomStatusMessage(undefined);
        setCitationsHistory((prev) => [newCitation, ...prev]);
      } else if (res?.citationTrouvee === false) {
        setCitation(null);
        setStatus("notfound");
        setCustomStatusMessage(undefined);
      } else {
        setCitation(null);
        setStatus("error");
        setCustomStatusMessage(res?.error);
      }
    }
  );

  const handleMicClick = () => {
    if (isListening) {
      stop();
      setStatus("default");
      setCustomStatusMessage(undefined);
    } else {
      setStatus("listening");
      setCustomStatusMessage(undefined);
      start();
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-3 sm:space-y-6">
      {/* Contrôles micro */}
      <MicControls
        isListening={isListening}
        onMicClick={handleMicClick}
      />

      {/* Transcription */}
      <Transcription text={transcript} />

      {/* Loader */}
      <Loader show={loader} />

      {/* Status */}
      <Status
        statusType={status}
        customMessage={customStatusMessage}
      />

      {/* Citation détectée */}
      <CitationCard
        citation={citation?.citation || ""}
        auteur={citation?.auteur || ""}
        source={citation?.source || ""}
        date={citation?.date || ""}
        show={!!citation}
      />

      {/* Historique */}
      <CitationsHistory citations={citationsHistory} />
    </div>
  );
}
