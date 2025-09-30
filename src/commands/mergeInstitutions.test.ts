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
import {
  FinicityInstitution,
  getAggregatorInstitutionsPath,
  mapFinicityInstitution,
} from "../shared/utils/aggregatorInstitutions";
import { fakeEnvironment } from "../shared/test/environment";
import { ucpInstitutions } from "../shared/test/testData/ucpInstitutions";
import { AUTO_MATCHES_PATH } from "../shared/utils/institutionMatching";

vi.mock("@inquirer/prompts", { spy: true });

const finicityFilePath = getAggregatorInstitutionsPath(Aggregators.Finicity);
const ucpFilePath = getAggregatorInstitutionsPath(UCP_STRING);

describe("mergeInstitutions", () => {
  beforeEach(async () => {
    vi.spyOn(config, "getConfig").mockReturnValue(fakeEnvironment);

    await promises.rm(finicityFilePath, { force: true });
    await promises.rm(ucpFilePath, { force: true });
    await promises.rm(AUTO_MATCHES_PATH, { force: true });
  });

  describe("all yes responses", () => {
    it("fetches aggregator institutions and stores them, fetches ucp institutions and stores them, matches institutions", async () => {
      vi.spyOn(prompts, "select").mockResolvedValueOnce(Aggregators.Finicity);
      vi.spyOn(prompts, "confirm")
        .mockResolvedValueOnce(true)
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
      expect(
        JSON.parse(await promises.readFile(AUTO_MATCHES_PATH, "utf-8"))
      ).toEqual([
        {
          aggregatorInstitution: mapFinicityInstitution(
            finicityInstitutionsPage1
              .institutions[0] as unknown as FinicityInstitution
          ),
          ucpInstitution: ucpInstitutions[0],
        },
      ]);
    });
  });

  describe("all no responses", () => {
    it("doesn't fetch aggregator institutions or ucp institutions if not requested", async () => {
      vi.spyOn(prompts, "select").mockResolvedValueOnce(Aggregators.Finicity);
      vi.spyOn(prompts, "confirm")
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false);

      await action();

      await expect(() => promises.access(finicityFilePath)).rejects.toThrow();
      await expect(() => promises.access(ucpFilePath)).rejects.toThrow();
    });
  });
});
