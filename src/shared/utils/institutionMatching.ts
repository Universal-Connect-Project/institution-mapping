import path from "path";
import { promises } from "fs";

export const INSTITUTION_MATCHES_FOLDER_PATH = path.resolve(
  __dirname,
  `../../../institutionMatches${process.env.VITEST ? "/test" : ""}`
);
export const AUTO_MATCHES_PATH = `${INSTITUTION_MATCHES_FOLDER_PATH}/autoMatches.json`;

export const createWriteToMatchFile =
  ({ fileName, matchType }: { fileName: string; matchType: string }) =>
  async (data: any[]) => {
    const folderPath = INSTITUTION_MATCHES_FOLDER_PATH;

    await promises.mkdir(folderPath, { recursive: true });

    const writePath = `${folderPath}/${fileName}`;

    await promises.writeFile(writePath, JSON.stringify(data, null, 2));

    console.log(`Wrote ${data.length} ${matchType} matches to ${writePath}`);
  };

export const writeAutoMatches = createWriteToMatchFile({
  fileName: "autoMatches.json",
  matchType: "auto",
});
