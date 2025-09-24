import { beforeEach, describe, expect, it, vi } from "vitest";
import * as prompts from "@inquirer/prompts";
import { action } from "./mergeInstitutions";
import { Aggregators, UCP_STRING } from "../shared/const/aggregators";
import * as config from "../environment";
import { promises } from "fs";
import {
  finicityInstitutionsPage1,
  finicityInstitutionsPage2,
} from "../shared/test/testData/finicityInstitutions";
import { getAggregatorInstitutionsPath } from "../shared/utils/aggregatorInstitutions";
import { fakeEnvironment } from "../shared/test/environment";
import { ucpInstitutions } from "../shared/test/testData/ucpInstitutions";

vi.mock("@inquirer/prompts", { spy: true });

const finicityFilePath = getAggregatorInstitutionsPath(Aggregators.Finicity);
const ucpFilePath = getAggregatorInstitutionsPath(UCP_STRING);

describe("mergeInstitutions", () => {
  beforeEach(async () => {
    vi.spyOn(config, "getConfig").mockReturnValue(fakeEnvironment);

    await promises.rm(finicityFilePath, { force: true });
    await promises.rm(ucpFilePath, { force: true });
  });

  it("fetches aggregator institutions and ucp institutions and stores them on yes", async () => {
    vi.spyOn(prompts, "select").mockResolvedValueOnce(Aggregators.Finicity);
    vi.spyOn(prompts, "confirm")
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);

    await action();

    expect(
      JSON.parse(await promises.readFile(finicityFilePath, "utf-8"))
    ).toEqual([
      ...finicityInstitutionsPage1.institutions,
      ...finicityInstitutionsPage2.institutions,
    ]);

    expect(JSON.parse(await promises.readFile(ucpFilePath, "utf-8"))).toEqual(
      ucpInstitutions
    );
  });

  it("doesn't fetch aggregator institutions or ucp institutions if not requested", async () => {
    vi.spyOn(prompts, "select").mockResolvedValueOnce(Aggregators.Finicity);
    vi.spyOn(prompts, "confirm")
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false);

    await action();

    await expect(() => promises.access(finicityFilePath)).rejects.toThrow();
    await expect(() => promises.access(ucpFilePath)).rejects.toThrow();
  });
});
