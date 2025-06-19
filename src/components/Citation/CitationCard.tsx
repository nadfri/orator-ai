interface CitationCardProps {
  citation: string;
  auteur: string;
  source: string;
  date: string;
  show: boolean;
}

export default function CitationCard({
  citation,
  auteur,
  source,
  date,
  show,
}: CitationCardProps) {
  if (!show) return null;
  return (
    <div className="w-full  mx-auto p-3 rounded-lg shadow bg-gray-800 border border-gray-700 flex flex-col gap-2">
      <h2 className="text-lg font-bold mb-1 text-blue-400 text-center">
        Citation détectée
      </h2>
      <blockquote className="text-base italic border-l-4 border-blue-400 pl-3 py-1 mb-1 text-gray-100 bg-gray-700 rounded">
        {citation}
      </blockquote>
      <div className="flex flex-col gap-1 text-sm text-gray-300">
        <span>
          <span className="font-semibold">Auteur :</span> {auteur}
        </span>
        <span>
          <span className="font-semibold">Source :</span> {source}
        </span>
        <span>
          <span className="font-semibold">Date :</span> {date}
        </span>
      </div>
    </div>
  );
}
