export default function Transcription({ text }: { text: string }) {
  return (
    <div className="w-full p-2 bg-gray-300 rounded-lg shadow-md min-h-[100px] text-gray-900 sticky top-20 z-20">
      <p className="italic">{text}</p>
    </div>
  );
}
