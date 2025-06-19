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
  error?: string;
};
