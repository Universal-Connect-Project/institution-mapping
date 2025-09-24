import { http, HttpResponse } from "msw";
import {
  FETCH_FINICITY_ACCESS_TOKEN_URL,
  FETCH_FINICITY_INSTITUTIONS_URL,
} from "../../fetchInstitutions/finicityInstitutions";
import {
  finicityInstitutionsPage1,
  finicityInstitutionsPage2,
} from "./testData/finicityInstitutions";
import { fakeEnvironment } from "./environment";
import { ucpInstitutions } from "./testData/ucpInstitutions";
import { ucpAccessToken } from "./testData/ucpAccessToken";

export const AUTH0_TOKEN_URL = `https://${fakeEnvironment.AUTH0_DOMAIN}/oauth/token`;
export const FETCH_UCP_INSTITUTIONS_URL = `${fakeEnvironment.UCP_INSTITUTION_LIST_BASE_URL}/institutions/cacheList/download`;

export const handlers = [
  http.post(AUTH0_TOKEN_URL, () =>
    HttpResponse.json({ access_token: "testToken" })
  ),
  http.post(FETCH_FINICITY_ACCESS_TOKEN_URL, () =>
    HttpResponse.json(ucpAccessToken)
  ),
  http.get(FETCH_FINICITY_INSTITUTIONS_URL, ({ request }) => {
    const url = new URL(request.url);
    const start = url.searchParams.get("start");

    if (start === "2") {
      return HttpResponse.json(finicityInstitutionsPage2);
    }

    return HttpResponse.json(finicityInstitutionsPage1);
  }),
  http.get(FETCH_UCP_INSTITUTIONS_URL, () => {
    return HttpResponse.json(ucpInstitutions);
  }),
];
