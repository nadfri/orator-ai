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
    <div className='w-full p-6 md:p-8 rounded-xl shadow bg-gray-800 border border-gray-700'>
      <h2 className='text-2xl md:text-3xl font-bold mb-3 text-blue-400'>
        Citation Détectée :
      </h2>
      <blockquote className='text-lg md:text-xl italic border-l-4 border-blue-400 pl-4 py-2 mb-4'>
        <p className='text-gray-100'>{citation}</p>
      </blockquote>
      <p className='text-md md:text-lg text-gray-300'>
        <strong className='font-semibold'>Auteur :</strong> {auteur}
      </p>
      <p className='text-md md:text-lg text-gray-300'>
        <strong className='font-semibold'>Source :</strong> {source}
      </p>
      <p className='text-md md:text-lg text-gray-300'>
        <strong className='font-semibold'>Date :</strong> {date}
      </p>
    </div>
  );
}
