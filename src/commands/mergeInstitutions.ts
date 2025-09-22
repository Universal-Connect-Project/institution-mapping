import { Command } from "commander";
import { select } from "@inquirer/prompts";
import { fetchInstitutions } from "../fetchInstitutions/fetchInstitutions";
import {
  AggregatorDisplayNameMap,
  Aggregators,
} from "../shared/const/aggregators";

export function loadCommands(program: Command) {
  program
    .command("merge")
    .description("Merge institutions")
    .action(async () => {
      const aggregator = await select({
        message: "Select an aggregator",
        choices: Object.values(Aggregators).map((aggregator) => ({
          name: AggregatorDisplayNameMap[aggregator],
          value: aggregator,
        })),
      });

      await fetchInstitutions(aggregator);
    });
}
