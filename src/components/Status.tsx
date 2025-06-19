interface StatusProps {
  message: string;
  color?: string;
}

export default function Status({ message, color = 'gray' }: StatusProps) {
  if (!message) return null;

  const colorClass =
    {
      gray: 'text-gray-400',
      red: 'text-red-600 dark:text-red-400',
      green: 'text-green-600 dark:text-green-400',
      blue: 'text-blue-600 dark:text-blue-400',
      yellow: 'text-yellow-600 dark:text-yellow-400',
      orange: 'text-orange-500 dark:text-orange-400',
    }[color] || 'text-gray-400';

  return (
    <p
      className={`text-center min-h-[1.5em] h-6 flex items-center justify-center ${colorClass}`}>
      {message}
    </p>
  );
}
