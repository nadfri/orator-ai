"use client";

import { useEffect, useState } from "react";

export const useSettings = () => {
  // Clé API
  const [apiKey, setApiKey] = useState("");
  // Modèle LLM
  const [model, setModel] = useState("deepseek/deepseek-chat-v3-0324");
  // Affichage du panneau de settings
  const [showSettings, setShowSettings] = useState(false);

  // Charger depuis localStorage au montage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKey = localStorage.getItem("openRouterApiKey");
      if (storedKey) setApiKey(storedKey);
      const storedModel = localStorage.getItem("llmModel");
      if (storedModel) setModel(storedModel);
    }
  }, []);

  // Mettre à jour la clé API
  const updateApiKey = (newApiKey: string) => {
    setApiKey(newApiKey);
    if (typeof window !== "undefined") {
      if (newApiKey) {
        localStorage.setItem("openRouterApiKey", newApiKey);
      } else {
        localStorage.removeItem("openRouterApiKey");
      }
    }
  };

  // Mettre à jour le modèle
  const updateModel = (newModel: string) => {
    setModel(newModel);
    if (typeof window !== "undefined") {
      localStorage.setItem("llmModel", newModel);
    }
  };

  const openSettings = () => setShowSettings(true);
  const closeSettings = () => setShowSettings(false);

  // Sauvegarder les paramètres
  const handleSaveSettings = (
    newApiKey: string,
    newModel: string,
    showNotification: (msg: string, color?: string) => void
  ) => {
    updateApiKey(newApiKey);
    updateModel(newModel);
    showNotification("Paramètres enregistrés.", "green");
    closeSettings();
  };

  return {
    apiKey,
    model,
    showSettings,
    openSettings,
    closeSettings,
    updateApiKey,
    updateModel,
    handleSaveSettings,
  };
};
