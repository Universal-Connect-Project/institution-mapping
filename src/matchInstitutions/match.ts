import { Aggregators } from "../shared/const/aggregators";
import { loadInstitutions } from "../shared/utils/aggregatorInstitutions";
import { writeAutoMatches } from "../shared/utils/institutionMatching";
import { Match } from "./const";
import { findPotentialMatches } from "./utils";

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";

const renderScore = (score: number) => {
  const percentageScore = score * 100;

  let colorCode: string;
  if (percentageScore >= 90) {
    colorCode = GREEN;
  } else if (percentageScore >= 70) {
    colorCode = YELLOW;
  } else {
    colorCode = RED;
  }
  return `${colorCode}${percentageScore}${RESET}`;
};

const twoSpaces = "  ";

const spacing = (num: number) => {
  let str = "";
  for (let i = 0; i < num; i++) {
    str += twoSpaces;
  }
  return str;
};

const displayMatch = (match: Match, index?: number) => {
  if (index) {
    console.log(`\nMatch #${index + 1}:`);
  }
  console.log(`${spacing(1)}Scores:`);
  console.log(
    `${spacing(2)}Top 2 Average Score: ${renderScore(match.top2AverageScore)}`
  );
  console.log(
    `${spacing(2)}Average Total Score: ${renderScore(match.averageTotalScore)}`
  );

  for (const score of match.scoreBreakdown) {
    console.log(
      `${spacing(2)}${score.name}: ${renderScore(score.score)} (${score.type})`
    );
  }

  console.log(`${spacing(1)}Institution:`);
  console.log(`${spacing(2)}Name: ${match.institution.name}`);
  console.log(`${spacing(2)}ID: ${match.institution.id}`);
  if (match.institution.url) {
    console.log(`${spacing(2)}URL: ${match.institution.url}`);
  }
};

export const match = async (aggregator: Aggregators) => {
  const startTime = Date.now();

  const aggregatorInstitutions = await loadInstitutions(aggregator);
  const ucpInstitutions = await loadInstitutions("ucp");

  const autoMatches: { aggregatorInstitution: any; ucpInstitution: any }[] = [];

  const handleAutoMatch = (aggregatorInstitution: any, firstMatch: any) => {
    const ucpInstitution = firstMatch.institution;

    console.log(
      "🤖 Auto-matching",
      aggregatorInstitution.name,
      "to",
      ucpInstitution.name
    );

    displayMatch(firstMatch);

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

  await writeAutoMatches(autoMatches);

  console.log("Total aggregator institutions:", aggregatorInstitutions.length);
  console.log("Total UCP institutions:", ucpInstitutions.length);
  console.log("Total auto-matches found:", autoMatches.length);
  console.log("Time taken (seconds):", (Date.now() - startTime) / 1000);
};
