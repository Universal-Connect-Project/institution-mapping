export enum MatchType {
  DomainSimilarity = "domain similarity",
  ExactDomain = "exact domain",
  ExactNormalized = "exact normalized",
  ExactOriginal = "exact original",
  Missing = "missing data",
  NoMatch = "no match",
  Similarity = "similarity",
  StartsWith = "starts with",
}

export interface Score {
  name: string;
  score: number;
  type: MatchType;
}
