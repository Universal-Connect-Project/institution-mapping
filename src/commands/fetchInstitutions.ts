import { Command } from "commander";
import { fetchAndStoreInstitutions } from "../fetchInstitutions/fetchAndStoreInstitutions";
import { selectAggregatorOrUcp } from "./utils";

export const action = async () => {
  const aggregatorOrUcp = await selectAggregatorOrUcp();

  await fetchAndStoreInstitutions({ aggregatorOrUcp });
};

export function loadFetchInstitutionsCommand(program: Command) {
  program.command("fetch").description("Fetch institutions").action(action);
}
