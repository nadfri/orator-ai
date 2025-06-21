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
    You are an assistant tasked with detecting whether the following text contains one or more famous quotes or proverbs.
    The text may be a spoken transcription, so it may contain hesitations, extra words, or slightly different formulations from the original quote. Be very tolerant.
    If you detect one or more quotes:
    1. For each quote, identify the exact quote.
    2. Identify the author (if known, otherwise "Unknown Author").
    3. Identify the source (work, speech, etc. if known, otherwise "Unknown Source").
    4. Identify the date or era (if known, otherwise "Unknown Date").
    Respond ONLY in JSON with the following format. Do not add any text before or after the JSON.
    If one or more quotes are found:
    {
      "citationTrouvee": true,
      "citations": [
        {
          "citation": "The exact and complete quote",
          "auteur": "Author's name",
          "source": "Source of the quote",
          "date": "Date or era"
        },
        // ... possibly other quotes ...
      ]
    }
    If no quote is clearly identified, even with tolerance, respond:
    {
      "citationTrouvee": false
    }
    Here is the text to analyze: "${text}"
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
