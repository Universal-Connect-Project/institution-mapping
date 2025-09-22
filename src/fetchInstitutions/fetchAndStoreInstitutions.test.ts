import { describe, expect, it, vi } from "vitest";
import * as config from "../environment";
import { fetchAndStoreInstitutions } from "./fetchAndStoreInstitutions";
import { Aggregators } from "../shared/const/aggregators";
import { promises } from "fs";
import path from "path";
import {
  finicityInstitutionsPage1,
  finicityInstitutionsPage2,
} from "../shared/test/testData/finicityInstitutions";

describe("fetchAndStoreInstitutions", () => {
  it(`fetches institutions and stores them for ${Aggregators.Finicity}`, async () => {
    vi.spyOn(config, "getConfig").mockReturnValue({
      FINICITY_APP_KEY: "fakeKey",
      FINICITY_PARTNER_ID: "fakeId",
      FINICITY_SECRET: "fakeSecret",
    });

    const finicityFilePath = path.resolve(
      __dirname,
      `../../aggregatorInstitutions/${Aggregators.Finicity}.json`
    );

    await promises.rm(finicityFilePath, { force: true });

    await fetchAndStoreInstitutions(Aggregators.Finicity);

    expect(
      JSON.parse(await promises.readFile(finicityFilePath, "utf-8"))
    ).toEqual([
      ...finicityInstitutionsPage1.institutions,
      ...finicityInstitutionsPage2.institutions,
    ]);
  });

  it("throws an error for unsupported aggregators", async () => {
    await expect(
      fetchAndStoreInstitutions("UnsupportedAggregator")
    ).rejects.toThrow("Missing fetch functionality for UnsupportedAggregator");
  });
});
