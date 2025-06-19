import { Citation } from "@/types";

export default function CitationsHistory({
  citations,
}: {
  citations: Citation[];
}) {
  if (!citations.length) return null;

  return (
    <div className="w-full  flex flex-col gap-3 mt-4">
      {citations.map((cit, idx) => (
        <div
          key={idx}
          className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow flex flex-col gap-1"
        >
          <blockquote className="text-blue-300 italic text-base mb-1">
            {cit.citation}
          </blockquote>
          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
            <span>
              <strong>Auteur :</strong> {cit.auteur}
            </span>
            <span>
              <strong>Source :</strong> {cit.source}
            </span>
            <span>
              <strong>Date :</strong> {cit.date}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
