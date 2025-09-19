import fs from "fs";
import path from "path";

interface FinicityBaseInstitution {
  id: number;
  name: string;
  urlHomeApp: string;
}

interface UCPBaseInstitution {
  id: string;
  name: string;
  url: string;
}

const convertFinicityInstitutionToUCPInstitution = (
  finicityInstitution: FinicityBaseInstitution
): UCPBaseInstitution => {
  return {
    id: finicityInstitution.id.toString(),
    name: finicityInstitution.name,
    url: finicityInstitution.urlHomeApp,
  };
};

const readFinicityFile = async (): Promise<FinicityBaseInstitution[]> => {
  const data = await fs.promises.readFile(
    path.resolve(
      path.join(__dirname, "../../aggregatorInstitutions/finicity.json")
    ),
    "utf-8"
  );

  return JSON.parse(data) as FinicityBaseInstitution[];
};

export const readFinicityInstitutionsAndConvertToUCP = async (): Promise<
  UCPBaseInstitution[]
> => {
  const finicityInstitutions = await readFinicityFile();

  return finicityInstitutions.map(convertFinicityInstitutionToUCPInstitution);
};
