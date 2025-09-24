import { describe, expect, it, vi } from "vitest";
import { fetchAccessToken, fetchUcpInstitutions } from "./ucpInstitutions";
import * as config from "../environment";
import { fakeEnvironment } from "../shared/test/environment";
import { ucpAccessToken } from "../shared/test/testData/ucpAccessToken";
import { server } from "../shared/test/testServer";
import { http, HttpResponse } from "msw";
import {
  AUTH0_TOKEN_URL,
  FETCH_UCP_INSTITUTIONS_URL,
} from "../shared/test/handlers";
import { ucpInstitutions } from "../shared/test/testData/ucpInstitutions";

describe("ucpInstitutions", () => {
  describe("fetchAccessToken", () => {
    it("should fetch an access token", async () => {
      vi.spyOn(config, "getConfig").mockReturnValue(fakeEnvironment);

      expect(await fetchAccessToken()).toBe(ucpAccessToken.token);
    });

    it("should throw an error if environment variables are missing", async () => {
      vi.spyOn(config, "getConfig").mockReturnValue({
        ...fakeEnvironment,
        UCP_PASSWORD: undefined,
      });

      await expect(() => fetchAccessToken()).rejects.toThrow(
        "Missing UCP environment variables"
      );
    });

    it("should throw an error if the fetch fails", async () => {
      vi.spyOn(config, "getConfig").mockReturnValue(fakeEnvironment);

      server.use(
        http.post(
          AUTH0_TOKEN_URL,
          () => new HttpResponse(null, { status: 400 })
        )
      );

      await expect(() => fetchAccessToken()).rejects.toThrow(
        "Failed to fetch UCP access token:"
      );
    });
  });

  describe("fetchUcpInstitutions", () => {
    it("should fetch UCP institutions", async () => {
      vi.spyOn(config, "getConfig").mockReturnValue(fakeEnvironment);

      expect(await fetchUcpInstitutions()).toEqual(ucpInstitutions);
    });

    it("should throw an error if the fetch fails", async () => {
      vi.spyOn(config, "getConfig").mockReturnValue(fakeEnvironment);

      server.use(
        http.get(
          FETCH_UCP_INSTITUTIONS_URL,
          () => new HttpResponse(null, { status: 400 })
        )
      );

      await expect(() => fetchUcpInstitutions()).rejects.toThrow(
        "Failed to fetch UCP institutions:"
      );
    });
  });
});
