import CitationDetector from '@/components/Citation/CitationDetector';
import Header from '@/components/Header/Header';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col items-center px-2 pb-2 bg-gray-900 text-gray-100 relative'>
      <Header />
      {/* Détecteur de citations */}
      <CitationDetector />
    </div>
  );
}
