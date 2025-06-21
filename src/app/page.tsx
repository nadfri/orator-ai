import CitationDetector from "@/components/Citation/CitationDetector";
import Header from "@/components/Header/Header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center px-2 pb-2 bg-gray-900 text-gray-100 relative">
      <div className="container mx-auto max-w-3xl">
        <Header />

        {/* Detector */}
        <CitationDetector />
      </div>
    </div>
  );
}
