import path from "path";
import { promises } from "fs";
import { Aggregators } from "../const/aggregators";
import { AggregatorMatchingInstitution } from "../const/aggregatorInstitution";

export const getAggregatorInstitutionsFolderPath = () => {
  const basePath = `../../../aggregatorInstitutions${
    process.env.VITEST ? "/test" : ""
  }`;

  return path.resolve(__dirname, basePath);
};

export const getAggregatorInstitutionsPath = (aggregator: string) => {
  return `${getAggregatorInstitutionsFolderPath()}/${aggregator}.json`;
};

export interface FinicityInstitution {
  accountOwner: boolean;
  ach: boolean;
  aha: boolean;
  id: string;
  name: string;
  transAgg: boolean;
  urlHomeApp: string;
}

export const mapFinicityInstitution = ({
  id,
  name,
  urlHomeApp,
}: FinicityInstitution): AggregatorMatchingInstitution => {
  return {
    id,
    name,
    url: urlHomeApp,
  };
};

export const loadInstitutions = async (aggregatorOrUcp: string) => {
  const institutionsPath = getAggregatorInstitutionsPath(aggregatorOrUcp);

  try {
    const data = await promises.readFile(institutionsPath, "utf-8");

    const parsedData = JSON.parse(data);

    switch (aggregatorOrUcp) {
      case Aggregators.Finicity:
        return parsedData.map(mapFinicityInstitution);
      default:
        return parsedData;
    }
  } catch (error) {
    console.error(`Error loading institutions for ${aggregatorOrUcp}:`, error);

    throw error;
  }
};
