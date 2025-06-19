export default function Transcription({ text }: { text: string }) {
  return (
    <div className="w-full p-2 bg-gray-800 rounded-lg shadow-md min-h-[100px] text-gray-100 sticky top-20 z-20">
      <p className="italic">{text}</p>
    </div>
  );
}
