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
  if (!aggregatorInstitutionName || !ucpInstitutionName) {
    return 0;
  }

  const normalizedAggregatorInstitutionName = normalizeInstitutionName(
    aggregatorInstitutionName
  );
  const trimmedAggregatorInstitutionName = aggregatorInstitutionName
    .toLowerCase()
    .trim();

  const normalizedUcpName = normalizeInstitutionName(ucpInstitutionName);
  const trimmedUcpName = ucpInstitutionName.toLowerCase().trim();

  if (trimmedAggregatorInstitutionName === trimmedUcpName) {
    return 1.0;
  }

  if (normalizedAggregatorInstitutionName === normalizedUcpName) {
    return 0.95;
  }

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

    if (similarity >= 0.5) {
      return similarity;
    } else if (
      normalizedAggregatorInstitutionName.startsWith(normalizedUcpName) ||
      normalizedUcpName.startsWith(normalizedAggregatorInstitutionName)
    ) {
      return 0.4;
    }
  }

  return 0;
};

export const extractDomain = (url: string): string => {
  let domain = `${url}`;

  if (domain.includes(".")) {
    domain = domain.split(".")?.pop() as string;
  }

  if (domain.includes("/")) {
    domain = domain.split("/")[0];
  }

  return domain;
};

export const normalizeUrl = (url: string): string => {
  return url
    .toLowerCase()
    .trim()
    .replace(/http[s]?:\/\//, "")
    .replace(/\.com/, "")
    .replace(/\.net/, "")
    .replace(/\.org/, "")
    .replace(/www\./, "");
};

export const calculateUrlScore = (aggregatorUrl: string, ucpUrl: string) => {
  if (!aggregatorUrl || !ucpUrl) {
    return 0;
  }

  const normalizedAggregatorUrl = normalizeUrl(aggregatorUrl);
  const normalizedUcpUrl = normalizeUrl(ucpUrl);

  const similarity = calculateSimilarity(
    normalizedAggregatorUrl,
    normalizedUcpUrl
  );

  const plaidDomain = extractDomain(normalizedAggregatorUrl);
  const ucpDomain = extractDomain(normalizedUcpUrl);

  const domainSimilarity = calculateSimilarity(plaidDomain, ucpDomain) * 0.9;

  return similarity >= domainSimilarity ? similarity : domainSimilarity;
};

interface AggregatorInstitution {
  name?: string;
  url?: string;
}

export const findPotentialMatches = (
  aggregatorInstitution: AggregatorInstitution,
  ucpInstitutions: any[]
) => {
  const maxResults = 5;

  const matches = [];

  for (const ucpInst of ucpInstitutions) {
    const scores = {
      ...(aggregatorInstitution.name
        ? { name: calculateNameScore(aggregatorInstitution.name, ucpInst.name) }
        : {}),
      ...(aggregatorInstitution.url
        ? { url: calculateUrlScore(aggregatorInstitution.url, ucpInst.url) }
        : {}),
    };

    const sortedScores = Object.values(scores).sort((a, b) => b - a);

    let topScoresAverage = sortedScores?.[0];

    if (sortedScores.length >= 2) {
      topScoresAverage = (sortedScores[0] + sortedScores[1]) / 2;
    }

    const averageTotalScore =
      sortedScores.reduce((accumulator, current) => accumulator + current, 0) /
      sortedScores.length;

    const matchTypes = [];

    if (scores.name) {
      if (scores.name === 1.0) {
        matchTypes.push("nameExactOriginal");
      } else if (scores.name >= 0.95) {
        matchTypes.push("nameExactNormalized");
      } else {
        matchTypes.push("nameSimilarity");
      }
    }

    if (scores.url) {
      if (scores.url >= 0.95) {
        matchTypes.push("urlExactNormalized");
      } else {
        matchTypes.push("urlDomainSimilarity");
      }
    }

    if (topScoresAverage > 0.49) {
      matches.push({
        institution: ucpInst,
        score: topScoresAverage,
        averageTotalScore,
        matchTypes: matchTypes,
        scoreBreakdown: scores,
      });
    }
  }

  // Sort by score (highest first) and return top results
  return matches.sort((a, b) => b.score - a.score).slice(0, maxResults);
};
