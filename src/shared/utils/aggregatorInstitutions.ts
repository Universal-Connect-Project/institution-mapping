import path from "path";

export const getAggregatorInstitutionsFolderPath = () => {
  const basePath = `../../../aggregatorInstitutions${
    process.env.VITEST ? "/test" : ""
  }`;

  return path.resolve(__dirname, basePath);
};

export const getAggregatorInstitutionsPath = (aggregator: string) => {
  return `${getAggregatorInstitutionsFolderPath()}/${aggregator}.json`;
};
