export default function Loader({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="loader mx-auto my-2">
      <span className="block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
