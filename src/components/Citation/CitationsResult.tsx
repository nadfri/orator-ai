import type { Citation } from "@/types";
import CitationCard from "./CitationCard";

interface CitationsResultProps {
  citation: Citation | Citation[] | null;
}

export default function CitationsResult({ citation }: CitationsResultProps) {
  if (Array.isArray(citation) && citation.length > 0) {
    return (
      <>
        {citation.map((c, i) => (
          <CitationCard
            key={i}
            citation={c}
          />
        ))}
      </>
    );
  }
  if (citation && !Array.isArray(citation)) {
    return <CitationCard citation={citation} />;
  }
  return null;
}
