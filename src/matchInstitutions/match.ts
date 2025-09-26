import { Aggregators } from "../shared/const/aggregators";
import { loadInstitutions } from "../shared/utils/aggregatorInstitutions";
import { Match } from "./const";
import { findPotentialMatches } from "./utils";

const displayMatch = (match: Match, index?: number) => {
  if (index) {
    console.log(`\nMatch #${index + 1}:`);
  }
  console.log("   Scores:");
  console.log(`     Top 2 Average Score: ${match.top2AverageScore * 100}`);
  console.log(`     Average Total Score: ${match.averageTotalScore * 100}`);

  for (const score of match.scoreBreakdown) {
    console.log(`     ${score.name}: ${score.score * 100} (${score.type})`);
  }

  console.log("   Institution:");
  console.log(`     Name: ${match.institution.name}`);
  console.log(`     ID: ${match.institution.id}`);
  if (match.institution.url) {
    console.log(`     URL: ${match.institution.url}`);
  }
};

export const match = async (aggregator: Aggregators) => {
  const aggregatorInstitutions = await loadInstitutions(aggregator);
  const ucpInstitutions = await loadInstitutions("ucp");

  const autoMatches = [];

  const handleAutoMatch = (aggregatorInstitution: any, firstMatch: any) => {
    const ucpInstitution = firstMatch.institution;

    console.log(
      "🤖 Auto-matching",
      aggregatorInstitution.name,
      "to",
      ucpInstitution.name
    );

    displayMatch(firstMatch, 0);

    console.log("\n");

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
        if (firstMatch.top2AverageScore >= 0.8) {
          handleAutoMatch(aggregatorInstitution, firstMatch);
        }
      } else if (matches.length > 1) {
        if (firstMatch.top2AverageScore >= 0.9) {
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
