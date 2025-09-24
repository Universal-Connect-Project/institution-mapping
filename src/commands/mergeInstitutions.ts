import { Command } from "commander";
import { fetchAndStoreInstitutions } from "../fetchInstitutions/fetchAndStoreInstitutions";
import { selectAggregator } from "./utils";
import { confirm } from "@inquirer/prompts";
import { UCP_STRING } from "../shared/const/aggregators";

export const action = async () => {
  const aggregator = await selectAggregator();

  const fetchAggregatorInstitutions = await confirm({
    default: false,
    message: `Do you want to fetch a new list of institutions for ${aggregator}?`,
  });

  if (fetchAggregatorInstitutions) {
    await fetchAndStoreInstitutions({ aggregatorOrUcp: aggregator });
  } else {
    console.log("Skipping fetching new institutions.");
  }

  const fetchUcpInstitutions = await confirm({
    default: false,
    message: `Do you want to fetch a new ucp institution list?`,
  });

  if (fetchUcpInstitutions) {
    await fetchAndStoreInstitutions({ aggregatorOrUcp: UCP_STRING });
  } else {
    console.log("Skipping fetching new institutions.");
  }
};

export function loadMergeInstitutionsCommand(program: Command) {
  program.command("merge").description("Merge institutions").action(action);
}
