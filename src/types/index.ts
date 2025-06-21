export type Citation = {
  citation: string;
  auteur: string;
  source: string;
  date: string;
};

export type DetectionResult = {
  citationTrouvee: boolean;
  citation?: string;
  auteur?: string;
  source?: string;
  date?: string;
  citations?: Citation[]; // Ajouté pour supporter plusieurs citations
  error?: string;
};

export type StatusType =
  | "default"
  | "listening"
  | "searching"
  | "found"
  | "notfound"
  | "error";
