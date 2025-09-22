import { beforeEach, describe, expect, it, vi } from "vitest";
import * as config from "../environment";
import { fetchAndStoreInstitutions } from "./fetchAndStoreInstitutions";
import { Aggregators } from "../shared/const/aggregators";
import { promises } from "fs";
import path from "path";
import {
  finicityInstitutionsPage1,
  finicityInstitutionsPage2,
} from "../shared/test/testData/finicityInstitutions";
import { server } from "../shared/test/testServer";
import { http, HttpResponse } from "msw";
import { FETCH_FINICITY_INSTITUTIONS_URL } from "./finicityInstitutions";

describe("fetchAndStoreInstitutions", () => {
  describe("finicity", () => {
    beforeEach(() => {
      vi.spyOn(config, "getConfig").mockReturnValue({
        FINICITY_APP_KEY: "fakeKey",
        FINICITY_PARTNER_ID: "fakeId",
        FINICITY_SECRET: "fakeSecret",
      });
    });

    it(`fetches institutions, creates a directory if it doesn't exist, and stores the institutions ${Aggregators.Finicity}`, async () => {
      const folderPath = path.join(__dirname, "../../aggregatorInstitutions");

      await promises.rmdir(folderPath, { recursive: true });

      await fetchAndStoreInstitutions(Aggregators.Finicity);

      const finicityFilePath = path.resolve(
        __dirname,
        `../../aggregatorInstitutions/${Aggregators.Finicity}.json`
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
        fetchAndStoreInstitutions(Aggregators.Finicity)
      ).rejects.toThrow(`No institutions found for ${Aggregators.Finicity}`);
    });
  });

  it("throws an error for unsupported aggregators", async () => {
    await expect(
      fetchAndStoreInstitutions("UnsupportedAggregator")
    ).rejects.toThrow("Missing fetch functionality for UnsupportedAggregator");
  });
});
