import { Command } from "commander";
import { fetchAndStoreInstitutions } from "../fetchInstitutions/fetchAndStoreInstitutions";
import { selectAggregator } from "./utils";
import { confirm } from "@inquirer/prompts";

export const action = async () => {
  const aggregator = await selectAggregator();

  const answer = await confirm({
    default: false,
    message: `Do you want to fetch a new list of institutions for ${aggregator}?`,
  });

  if (answer) {
    await fetchAndStoreInstitutions({ aggregatorOrUcp: aggregator });
  } else {
    console.log("Skipping fetching new institutions.");
  }
};

export function loadMergeInstitutionsCommand(program: Command) {
  program.command("merge").description("Merge institutions").action(action);
}
