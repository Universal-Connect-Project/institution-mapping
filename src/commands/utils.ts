import { select } from "@inquirer/prompts";
import { Aggregators } from "../shared/const/aggregators";

export const selectAggregator = async () =>
  await select({
    message: "Select an aggregator",
    choices: Object.values(Aggregators).map((aggregator) => ({
      name: aggregator,
      value: aggregator,
    })),
  });
