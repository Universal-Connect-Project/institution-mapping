export function normalizeInstitutionName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim()
      // Remove common banking suffixes/prefixes but keep location indicators
      // .replace(/\b(federal credit union|fcu|credit union|cu|national bank|state bank|community bank|savings bank|trust company|corp|corporation|inc|llc)\b/g, '')
      .replace(/\b(bank)\b(?!\s+(of|for|in))/g, "") // Remove "bank" but not "bank of" or "bank for"
      .replace(/ cu/g, "") // Remove "CU"
      .replace(/ credit union/g, "") // Remove "credit union"
      .replace(/\s+/g, " ")
      .trim()
  );
}

export const calculateEditDistance = (str1: string, str2: string): number => {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

export const calculateSimilarity = (str1: string, str2: string): number => {
  const stripped1 = str1
    .toLowerCase()
    .replace(/ /g, "")
    .replace(/\-/g, "")
    .replace(/(ca)/g, "canada");
  const stripped2 = str2
    .toLowerCase()
    .replace(/ /g, "")
    .replace(/\-/g, "")
    .replace(/(ca)/g, "canada");

  const longer = stripped1.length > stripped2.length ? stripped1 : stripped2;

  if (longer.length === 0) return 1.0;

  const editDistance = calculateEditDistance(stripped1, stripped2);

  return (longer.length - editDistance) / longer.length;
};

export const calculateNameScore = (
  aggregatorInstitutionName: string,
  ucpInstitutionName: string
) => {
  const normalizedAggregatorInstitutionName = normalizeInstitutionName(
    aggregatorInstitutionName
  );
  const trimmedAggregatorInstitutionName = aggregatorInstitutionName
    .toLowerCase()
    .trim();

  const normalizedUcpName = normalizeInstitutionName(ucpInstitutionName);
  const trimmedUcpName = ucpInstitutionName.toLowerCase().trim();

  // Exact match on original names (highest priority)
  if (trimmedAggregatorInstitutionName === trimmedUcpName) {
    return 1.0;
  }

  // Exact match on normalized names
  if (normalizedAggregatorInstitutionName === normalizedUcpName) {
    return 0.95;
  }

  // Calculate similarity score for partial matches
  if (normalizedAggregatorInstitutionName && normalizedUcpName) {
    let similarity = calculateSimilarity(
      normalizedAggregatorInstitutionName,
      normalizedUcpName
    );

    if (
      (normalizedAggregatorInstitutionName.includes("business") &&
        normalizedUcpName.includes("personal")) ||
      (normalizedAggregatorInstitutionName.includes("personal") &&
        normalizedUcpName.includes("business"))
    ) {
      similarity -= 0.1;
    }

    // Only return similarity scores above a threshold
    if (similarity >= 0.5) {
      return similarity;
    } else if (
      normalizedAggregatorInstitutionName.startsWith(normalizedUcpName) ||
      normalizedUcpName.startsWith(normalizedAggregatorInstitutionName)
    ) {
      // If one name starts with the other, give a small boost
      return 0.4;
    }
  }

  return 0;
};
