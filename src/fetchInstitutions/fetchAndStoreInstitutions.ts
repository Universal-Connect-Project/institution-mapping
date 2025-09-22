import { fetchFinicityInstitutions } from "./finicityInstitutions";
import { Aggregators } from "../shared/const/aggregators";
import { promises } from "fs";
import path from "path";

export const fetchAndStoreInstitutions = async (aggregator: string) => {
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
