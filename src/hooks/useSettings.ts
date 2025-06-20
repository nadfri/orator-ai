"use client";

import { useEffect, useState } from "react";

export const useSettings = () => {
  // API key
  const [apiKey, setApiKey] = useState("");
  // LLM model
  const [model, setModel] = useState("deepseek/deepseek-chat-v3-0324");
  // Show settings panel
  const [showSettings, setShowSettings] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKey = localStorage.getItem("openRouterApiKey");
      if (storedKey) setApiKey(storedKey);
      const storedModel = localStorage.getItem("llmModel");
      if (storedModel) setModel(storedModel);
    }
  }, []);

  // Update API key
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

  // Update model
  const updateModel = (newModel: string) => {
    setModel(newModel);
    if (typeof window !== "undefined") {
      localStorage.setItem("llmModel", newModel);
    }
  };

  const openSettings = () => setShowSettings(true);
  const closeSettings = () => setShowSettings(false);

  // Save settings
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
