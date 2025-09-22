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

  if (!institutions.length) {
    throw new Error(`No institutions found for ${aggregator}`);
  }

  console.log(`Fetched ${institutions.length} institutions from ${aggregator}`);

  const folderPath = path.join(__dirname, "../../aggregatorInstitutions");

  await promises.mkdir(folderPath, { recursive: true });

  const writePath = path.join(folderPath, `/${aggregator}.json`);

  await promises.writeFile(writePath, JSON.stringify(institutions, null, 2));

  console.log(`Wrote ${institutions.length} institutions to ${writePath}`);
};
