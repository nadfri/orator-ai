"use server";

export async function detectCitation({
  text,
  model,
  apiKey,
}: {
  text: string;
  model: string;
  apiKey?: string;
}) {
  const finalApiKey = apiKey || process.env.OPENROUTER_API_KEY;

  if (!finalApiKey) {
    return {
      error: "Clé API non configurée. Veuillez l'ajouter dans les paramètres.",
    };
  }

  const prompt = `
    Tu es un assistant chargé de détecter si le texte suivant contient une citation célèbre ou un proverbe.
    Le texte peut être une transcription orale, donc il peut contenir des hésitations, des mots en trop, ou des formulations légèrement différentes de la citation originale. Sois très tolérant.
    Si tu détectes une citation :
    1. Identifie la citation exacte.
    2. Identifie l'auteur (si connu, sinon "Auteur inconnu").
    3. Identifie la source (œuvre, discours, etc. si connue, sinon "Source inconnue").
    4. Identifie la date ou l'époque (si connue, sinon "Date inconnue").
    Réponds UNIQUEMENT en JSON avec le format suivant. N'ajoute aucun texte avant ou après le JSON.
    Si une citation est trouvée :
    {
      "citationTrouvee": true,
      "citation": "La citation exacte et complète",
      "auteur": "Nom de l'auteur",
      "source": "Source de la citation",
      "date": "Date ou époque"
    }
    Si aucune citation n'est clairement identifiée, même avec tolérance, réponds :
    {
      "citationTrouvee": false
    }
    Voici le texte à analyser : "${text}"
  `;
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${finalApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );
    if (!response.ok) {
      return { error: `Erreur API: ${response.status} ${response.statusText}` };
    }
    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    content = content.replace(/^```json\s*|```$/g, "").trim();
    try {
      return JSON.parse(content);
    } catch (e) {
      return { error: "Erreur de parsing JSON.", raw: content };
    }
  } catch (e) {
    return { error: "Erreur réseau ou serveur.", details: String(e) };
  }
}
