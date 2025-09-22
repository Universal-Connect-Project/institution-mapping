import { select } from "@inquirer/prompts";
import {
  AggregatorDisplayNameMap,
  Aggregators,
} from "../shared/const/aggregators";

export const selectAggregator = async () =>
  await select({
    message: "Select an aggregator",
    choices: Object.values(Aggregators).map((aggregator) => ({
      name: AggregatorDisplayNameMap[aggregator],
      value: aggregator,
    })),
  });
