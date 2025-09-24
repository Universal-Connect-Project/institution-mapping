import { fetchFinicityInstitutions } from "./finicityInstitutions";
import { Aggregators, UCP_STRING } from "../shared/const/aggregators";
import { promises } from "fs";
import {
  getAggregatorInstitutionsFolderPath,
  getAggregatorInstitutionsPath,
} from "../shared/utils/aggregatorInstitutions";
import { fetchUcpInstitutions } from "./ucpInstitutions";

export const fetchAndStoreInstitutions = async ({
  aggregatorOrUcp,
}: {
  aggregatorOrUcp: string;
}) => {
  let institutions;

  switch (aggregatorOrUcp) {
    case Aggregators.Finicity:
      institutions = await fetchFinicityInstitutions();
      break;

    case UCP_STRING:
      institutions = await fetchUcpInstitutions();
      break;

    default:
      throw new Error(`Missing fetch functionality for ${aggregatorOrUcp}`);
  }

  if (!institutions.length) {
    throw new Error(`No institutions found for ${aggregatorOrUcp}`);
  }

  console.log(
    `Fetched ${institutions.length} institutions from ${aggregatorOrUcp}`
  );

  const folderPath = getAggregatorInstitutionsFolderPath();

  await promises.mkdir(folderPath, { recursive: true });

  const writePath = getAggregatorInstitutionsPath(aggregatorOrUcp);

  await promises.writeFile(writePath, JSON.stringify(institutions, null, 2));

  console.log(`Wrote ${institutions.length} institutions to ${writePath}`);
};
