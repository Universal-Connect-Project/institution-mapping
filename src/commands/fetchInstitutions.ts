import { Command } from "commander";
import { fetchAndStoreInstitutions } from "../fetchInstitutions/fetchAndStoreInstitutions";
import { selectAggregator } from "./utils";

export function loadFetchInstitutionsCommand(program: Command) {
  program
    .command("fetch")
    .description("Fetch institutions")
    .action(async () => {
      const aggregator = await selectAggregator();

      await fetchAndStoreInstitutions(aggregator);
    });
}
