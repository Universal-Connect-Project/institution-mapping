import { beforeEach, describe, expect, it, vi } from "vitest";
import * as config from "../environment";
import {
  FETCH_FINICITY_ACCESS_TOKEN_URL,
  FETCH_FINICITY_INSTITUTIONS_URL,
  fetchFinicityInstitutions,
} from "./finicityInstitutions";
import {
  finicityInstitutionsPage1,
  finicityInstitutionsPage2,
} from "../shared/test/testData/finicityInstitutions";
import { server } from "../shared/test/testServer";
import { http, HttpResponse } from "msw";

describe("finicity institutions", () => {
  describe("fetchFinicityInstitutions", () => {
    describe("with valid configuration", () => {
      beforeEach(() => {
        vi.spyOn(config, "getConfig").mockReturnValue({
          FINICITY_APP_KEY: "fakeKey",
          FINICITY_PARTNER_ID: "fakeId",
          FINICITY_SECRET: "fakeSecret",
        });
      });

      it("fetches institutions from Finicity and stitches the pages together", async () => {
        expect(await fetchFinicityInstitutions()).toEqual([
          ...finicityInstitutionsPage1.institutions,
          ...finicityInstitutionsPage2.institutions,
        ]);
      });

      it("throws an error if fetching an access token fails", async () => {
        server.use(
          http.post(
            FETCH_FINICITY_ACCESS_TOKEN_URL,
            () => new HttpResponse(null, { status: 400 })
          )
        );

        await expect(() => fetchFinicityInstitutions()).rejects.toThrow(
          "Failed to authenticate with Finicity: Bad Request"
        );
      });

      it("throws an error if fetching institutions fails", async () => {
        server.use(
          http.get(
            FETCH_FINICITY_INSTITUTIONS_URL,
            () => new HttpResponse(null, { status: 400 })
          )
        );

        await expect(() => fetchFinicityInstitutions()).rejects.toThrow(
          "Failed to fetch institutions from Finicity: Bad Request"
        );
      });
    });

    it("throws an error if configuration is missing", async () => {
      vi.spyOn(config, "getConfig").mockReturnValue({
        FINICITY_APP_KEY: undefined,
        FINICITY_PARTNER_ID: "fakeId",
      } as unknown as config.Config);

      await expect(() => fetchFinicityInstitutions()).rejects.toThrow(
        "Missing Finicity environment variables"
      );
    });
  });
});
