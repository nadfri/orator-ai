import { AlertCircle, CheckCircle, Info } from "lucide-react";

import { StatusType } from "@/types";

type StatusProps = {
  statusType?: StatusType;
  customMessage?: string;
};

const colorStyles = {
  gray: {
    bg: "bg-gray-800",
    border: "border-gray-700",
    text: "text-gray-300",
    icon: (
      <Info
        size={16}
        className="text-gray-400 mr-2"
      />
    ),
  },
  red: {
    bg: "bg-red-900/60",
    border: "border-red-700/60",
    text: "text-red-400",
    icon: (
      <AlertCircle
        size={16}
        className="text-red-400 mr-2"
      />
    ),
  },
  green: {
    bg: "bg-green-900/60",
    border: "border-green-700/60",
    text: "text-green-400",
    icon: (
      <CheckCircle
        size={16}
        className="text-green-400 mr-2"
      />
    ),
  },
  blue: {
    bg: "bg-blue-900/60",
    border: "border-blue-700/60",
    text: "text-blue-400",
    icon: (
      <Info
        size={16}
        className="text-blue-400 mr-2"
      />
    ),
  },
  yellow: {
    bg: "bg-yellow-900/60",
    border: "border-yellow-700/60",
    text: "text-yellow-400",
    icon: (
      <AlertCircle
        size={16}
        className="text-yellow-400 mr-2"
      />
    ),
  },
  orange: {
    bg: "bg-orange-900/60",
    border: "border-orange-700/60",
    text: "text-orange-400",
    icon: (
      <AlertCircle
        size={16}
        className="text-orange-400 mr-2"
      />
    ),
  },
} as const;

const statusConfig = {
  default: {
    message: "Cliquez sur le micro pour commencer",
    color: "gray",
  },
  listening: {
    message: "Écoute en cours...",
    color: "blue",
  },
  searching: {
    message: "Recherche de citation...",
    color: "yellow",
  },
  found: {
    message: "Citation trouvée !",
    color: "green",
  },
  notfound: {
    message: "Aucune citation détectée dans la dernière phrase.",
    color: "gray",
  },
  error: {
    message: "Erreur inattendue.",
    color: "red",
  },
};

export default function Status({
  statusType = "default",
  customMessage,
}: StatusProps) {
  let message = customMessage || statusConfig[statusType].message;
  let color = statusConfig[statusType].color;
  if (!message) return null;
  const { bg, border, text, icon } =
    colorStyles[color as keyof typeof colorStyles] || colorStyles.gray;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 min-h-[1.5em] rounded-full border font-medium shadow-sm text-xs ${bg} ${border} ${text} transition-all duration-200`}
    >
      {icon}
      {message}
    </span>
  );
}
