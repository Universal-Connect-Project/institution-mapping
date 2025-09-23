import { select } from "@inquirer/prompts";
import { Aggregators, UCP_STRING } from "../shared/const/aggregators";

export const selectAggregator = async () =>
  await select({
    message: "Select an aggregator",
    choices: Object.values(Aggregators).map((aggregator) => ({
      name: aggregator,
      value: aggregator,
    })),
  });

export const selectAggregatorOrUcp = async () =>
  await select({
    message: "Select an aggregator or UCP",
    choices: [
      ...Object.values(Aggregators).map((aggregator) => ({
        name: aggregator,
        value: aggregator,
      })),
      {
        name: UCP_STRING,
        value: UCP_STRING,
      },
    ],
  });
