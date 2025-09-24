import { beforeEach, describe, expect, it, vi } from "vitest";
import * as prompts from "@inquirer/prompts";
import { action } from "./fetchInstitutions";
import { Aggregators } from "../shared/const/aggregators";
import * as config from "../environment";
import { promises } from "fs";
import {
  finicityInstitutionsPage1,
  finicityInstitutionsPage2,
} from "../shared/test/testData/finicityInstitutions";
import { getAggregatorInstitutionsPath } from "../shared/utils/aggregatorInstitutions";
import { fakeEnvironment } from "../shared/test/environment";

vi.mock("@inquirer/prompts", { spy: true });

const finicityFilePath = getAggregatorInstitutionsPath(Aggregators.Finicity);

describe("fetchInstitutions", () => {
  it("fetches institutions and stores them", async () => {
    vi.spyOn(config, "getConfig").mockReturnValue(fakeEnvironment);

    await promises.rm(finicityFilePath, { force: true });
    vi.spyOn(prompts, "select").mockResolvedValueOnce(Aggregators.Finicity);

    await action();

    expect(
      JSON.parse(await promises.readFile(finicityFilePath, "utf-8"))
    ).toEqual([
      ...finicityInstitutionsPage1.institutions,
      ...finicityInstitutionsPage2.institutions,
    ]);
  });
});
