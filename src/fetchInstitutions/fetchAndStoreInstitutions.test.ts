import { beforeEach, describe, expect, it, vi } from "vitest";
import * as config from "../environment";
import { fetchAndStoreInstitutions } from "./fetchAndStoreInstitutions";
import { Aggregators } from "../shared/const/aggregators";
import { promises } from "fs";
import {
  finicityInstitutionsPage1,
  finicityInstitutionsPage2,
} from "../shared/test/testData/finicityInstitutions";
import { server } from "../shared/test/testServer";
import { http, HttpResponse } from "msw";
import { FETCH_FINICITY_INSTITUTIONS_URL } from "./finicityInstitutions";
import {
  getAggregatorInstitutionsFolderPath,
  getAggregatorInstitutionsPath,
} from "../shared/utils/aggregatorInstitutions";
import { fakeEnvironment } from "../shared/test/environment";

describe("fetchAndStoreInstitutions", () => {
  describe("finicity", () => {
    beforeEach(() => {
      vi.spyOn(config, "getConfig").mockReturnValue(fakeEnvironment);
    });

    it(`fetches institutions, creates a directory if it doesn't exist, and stores the institutions ${Aggregators.Finicity}`, async () => {
      const folderPath = getAggregatorInstitutionsFolderPath();

      try {
        await promises.rmdir(folderPath, { recursive: true });
      } catch {
        // ignore
      }

      await fetchAndStoreInstitutions({
        aggregatorOrUcp: Aggregators.Finicity,
      });

      const finicityFilePath = getAggregatorInstitutionsPath(
        Aggregators.Finicity
      );

      expect(
        JSON.parse(await promises.readFile(finicityFilePath, "utf-8"))
      ).toEqual([
        ...finicityInstitutionsPage1.institutions,
        ...finicityInstitutionsPage2.institutions,
      ]);
    });

    it("throws an error if no institutions are found", async () => {
      server.use(
        http.get(FETCH_FINICITY_INSTITUTIONS_URL, () =>
          HttpResponse.json({ institutions: [] })
        )
      );

      await expect(() =>
        fetchAndStoreInstitutions({ aggregatorOrUcp: Aggregators.Finicity })
      ).rejects.toThrow(`No institutions found for ${Aggregators.Finicity}`);
    });
  });

  it("throws an error for unsupported aggregators", async () => {
    await expect(
      fetchAndStoreInstitutions({ aggregatorOrUcp: "UnsupportedAggregator" })
    ).rejects.toThrow("Missing fetch functionality for UnsupportedAggregator");
  });
});
