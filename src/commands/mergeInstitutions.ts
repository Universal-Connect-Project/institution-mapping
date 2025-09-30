import { Command } from "commander";
import { fetchAndStoreInstitutions } from "../fetchInstitutions/fetchAndStoreInstitutions";
import { selectAggregator } from "./utils";
import { confirm } from "@inquirer/prompts";
import { UCP_STRING } from "../shared/const/aggregators";
import { match } from "../matchInstitutions/match";
import { should } from "vitest";

export const action = async () => {
  const aggregator = await selectAggregator();

  const shouldFetchAggregatorInstitutions = await confirm({
    default: false,
    message: `Do you want to fetch a new list of institutions for ${aggregator}?`,
  });

  if (shouldFetchAggregatorInstitutions) {
    await fetchAndStoreInstitutions({ aggregatorOrUcp: aggregator });
  } else {
    console.log("Skipping fetching new institutions.");
  }

  const shouldFetchUcpInstitutions = await confirm({
    default: false,
    message: `Do you want to fetch a new ucp institution list?`,
  });

  if (shouldFetchUcpInstitutions) {
    await fetchAndStoreInstitutions({ aggregatorOrUcp: UCP_STRING });
  } else {
    console.log("Skipping fetching new institutions.");
  }

  const shouldMatchAllInstitutions = await confirm({
    default: false,
    message: `Do you want to match all institutions? (This may take a while)`,
  });

  if (shouldMatchAllInstitutions) {
    await match(aggregator);
  } else {
    console.log("Skipping matching institutions.");
  }
};

export function loadMergeInstitutionsCommand(program: Command) {
  program.command("merge").description("Merge institutions").action(action);
}
