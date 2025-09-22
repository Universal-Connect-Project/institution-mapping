import { confirm } from "@inquirer/prompts";
import { fetchFinicityInstitutions } from "./finicity";
import { Aggregators } from "../shared/const/aggregators";
import { promises } from "fs";
import path from "path";

export const fetchInstitutions = async (aggregator: string) => {
  const answer = await confirm({
    default: false,
    message: `Do you want to fetch a new list of institutions for ${aggregator}?`,
  });

  if (!answer) {
    console.log("Skipping fetching new institutions.");

    return;
  }

  let institutions;

  switch (aggregator) {
    case Aggregators.Finicity:
      institutions = await fetchFinicityInstitutions();
      break;

    default:
      throw new Error(`Missing fetch functionality for ${aggregator}`);
  }

  const writePath = path.join(
    __dirname,
    `../../aggregatorInstitutions/${aggregator}.json`
  );

  await promises.writeFile(writePath, JSON.stringify(institutions, null, 2));

  console.log(`Wrote ${institutions.length} institutions to ${writePath}`);
};
