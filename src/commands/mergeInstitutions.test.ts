import { beforeEach, describe, expect, it, vi } from "vitest";
import * as prompts from "@inquirer/prompts";
import { action } from "./mergeInstitutions";
import { Aggregators } from "../shared/const/aggregators";
import * as config from "../environment";
import { promises } from "fs";
import {
  finicityInstitutionsPage1,
  finicityInstitutionsPage2,
} from "../shared/test/testData/finicityInstitutions";
import { getAggregatorInstitutionsPath } from "../shared/utils/aggregatorInstitutions";

vi.mock("@inquirer/prompts", { spy: true });

const finicityFilePath = getAggregatorInstitutionsPath(Aggregators.Finicity);

describe("mergeInstitutions", () => {
  beforeEach(async () => {
    vi.spyOn(config, "getConfig").mockReturnValue({
      FINICITY_APP_KEY: "fakeKey",
      FINICITY_PARTNER_ID: "fakeId",
      FINICITY_SECRET: "fakeSecret",
    });

    await promises.rm(finicityFilePath, { force: true });
  });

  it("fetches institutions and stores them on yes", async () => {
    vi.spyOn(prompts, "select").mockResolvedValueOnce(Aggregators.Finicity);
    vi.spyOn(prompts, "confirm").mockResolvedValueOnce(true);

    await action();

    expect(
      JSON.parse(await promises.readFile(finicityFilePath, "utf-8"))
    ).toEqual([
      ...finicityInstitutionsPage1.institutions,
      ...finicityInstitutionsPage2.institutions,
    ]);
  });

  it("doesn't fetch institutions if not requested", async () => {
    vi.spyOn(prompts, "select").mockResolvedValueOnce(Aggregators.Finicity);
    vi.spyOn(prompts, "confirm").mockResolvedValueOnce(false);

    await action();

    await expect(() => promises.access(finicityFilePath)).rejects.toThrow();
  });
});
