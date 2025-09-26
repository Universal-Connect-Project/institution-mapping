import { Aggregators } from "../shared/const/aggregators";
import { loadInstitutions } from "../shared/utils/aggregatorInstitutions";
import { findPotentialMatches } from "./utils";

const displayMatch = (match: any, index: number) => {
  const confidence = (match.score * 100).toFixed(1);

  console.log(`${index + 1}. "${match.institution.name}"`);
  console.log(
    `   ${confidence}% - ${match.matchType} ${JSON.stringify(
      match.scoreBreakdown
    )}`
  );
  console.log(`   ${match.averageTotalScore * 100}`);
  console.log(`   ID: ${match.institution.id}`);
  if (match.institution.url) {
    console.log(`   URL: ${match.institution.url}`);
  }
  if (match.routing_numbers && match.routing_numbers.length > 0) {
    console.log(`   Routing Numbers: ${match.routing_numbers.join(", ")}`);
  }
};

export const match = async (aggregator: Aggregators) => {
  const aggregatorInstitutions = await loadInstitutions(aggregator);
  const ucpInstitutions = await loadInstitutions("ucp");

  const autoMatches = [];

  const handleAutoMatch = (aggregatorInstitution: any, firstMatch: any) => {
    const ucpInstitution = firstMatch.institution;

    displayMatch(firstMatch, 0);

    console.log(
      "Auto-matching",
      aggregatorInstitution.name,
      "to",
      ucpInstitution.name
    );

    autoMatches.push({
      aggregatorInstitution,
      ucpInstitution,
    });
  };

  for (const aggregatorInstitution of aggregatorInstitutions) {
    const matches = findPotentialMatches(
      aggregatorInstitution,
      ucpInstitutions
    );

    const [firstMatch] = matches;

    if (matches.length) {
      if (matches.length === 1) {
        if (firstMatch.score >= 0.8) {
          handleAutoMatch(aggregatorInstitution, firstMatch);
        }
      } else if (matches.length > 1) {
        if (firstMatch.score >= 0.9) {
          handleAutoMatch(aggregatorInstitution, firstMatch);
        } else if (firstMatch.averageTotalScore >= 0.85) {
          handleAutoMatch(aggregatorInstitution, firstMatch);
        }
      }
    }
  }

  console.log("Total aggregator institutions:", aggregatorInstitutions.length);
  console.log("Total UCP institutions:", ucpInstitutions.length);
  console.log("Total auto-matches found:", autoMatches.length);
};
