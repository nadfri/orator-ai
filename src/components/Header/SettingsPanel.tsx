"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useSettings } from "../../hooks/useSettings";

type SettingsPanelProps = {
  onClose: () => void;
  show: boolean;
  showNotification: (
    message: string,
    color?: string,
    duration?: number
  ) => void;
};

const MODELS = [
  {
    value: "deepseek/deepseek-chat-v3-0324",
    label: "deepseek-chat-v3-0324 (free)",
  },
  {
    value: "meta-llama/llama-3.1-8b-instruct",
    label: "Meta Llama 3.1 8B Instruct",
  },
  { value: "google/gemini-2.0-flash-001", label: "Google Gemini 2.0 Flash" },
  { value: "mistralai/mistral-7b-instruct", label: "Mistral 7B Instruct" },
];

export default function SettingsPanel({
  onClose,
  show,
  showNotification,
}: SettingsPanelProps) {
  const { apiKey, updateApiKey, model, updateModel } = useSettings();
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localModel, setLocalModel] = useState(model);

  // Sync with props when panel opens
  useEffect(() => {
    if (show) {
      setLocalApiKey(apiKey);
      setLocalModel(model);
    }
  }, [show, apiKey, model]);
  const handleSave = () => {
    updateApiKey(localApiKey);
    updateModel(localModel);
    showNotification("Paramètres enregistrés.", "green");
    onClose();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-800 shadow-xl p-6 w-full max-w-sm transform transition-transform duration-300 z-50 flex flex-col ${
        show ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        <X size={24} />
      </button>
      <h2 className="text-2xl font-bold mb-6 text-gray-100 text-center">
        Paramètres
      </h2>
      <div className="flex-1 flex flex-col justify-center space-y-4">
        {" "}
        <div>
          <label
            htmlFor="api-key"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Clé API OpenRouter
          </label>
          <input
            type="password"
            id="api-key"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              localApiKey
                ? "Clé personnalisée configurée"
                : "Laissez vide pour utiliser la clé par défaut"
            }
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">
            {localApiKey
              ? "Vous utilisez une clé personnalisée"
              : "Utilisation de la clé par défaut du fichier .env"}
          </p>
        </div>
        <div>
          <label
            htmlFor="model-select"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Modèle LLM
          </label>
          <select
            id="model-select"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={localModel}
            onChange={(e) => setLocalModel(e.target.value)}
          >
            {MODELS.map((m) => (
              <option
                key={m.value}
                value={m.value}
              >
                {m.label}
              </option>
            ))}
          </select>
        </div>{" "}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow mb-2"
        >
          Enregistrer
        </button>
        {localApiKey && (
          <button
            onClick={() => {
              setLocalApiKey("");
              updateApiKey("");
              updateModel(localModel);
              showNotification("Paramètres enregistrés.", "green");
              onClose();
            }}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md shadow"
          >
            Utiliser la clé par défaut
          </button>
        )}
      </div>
    </div>
  );
}
