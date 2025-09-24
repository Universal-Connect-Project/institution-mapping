import { getConfig } from "../environment";

export const getAccessToken = async () => {
  const {
    AUTH0_AUDIENCE,
    AUTH0_CLIENT_ID,
    AUTH0_DOMAIN,
    UCP_USERNAME,
    UCP_PASSWORD,
  } = getConfig();

  if (!AUTH0_DOMAIN || !UCP_USERNAME || !UCP_PASSWORD) {
    throw new Error("Missing UCP environment variables");
  }

  const props = {
    body: JSON.stringify({
      audience: AUTH0_AUDIENCE,
      client_id: AUTH0_CLIENT_ID,
      grant_type: "password",
      password: UCP_PASSWORD,
      scope: "openid profile email",
      username: UCP_USERNAME,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  };

  const response = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, props);

  if (!response.ok) {
    throw new Error(`Failed to get UCP access token: ${await response.text()}`);
  }

  const data = await response.json();

  return data.access_token;
};

export const fetchUcpInstitutions = async () => {
  const accessToken = await getAccessToken();

  const { UCP_INSTITUTION_LIST_BASE_URL } = getConfig();

  const response = await fetch(
    `${UCP_INSTITUTION_LIST_BASE_URL}/institutions/cacheList/download`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch institutions from UCP: ${response.statusText}`
    );
  }

  const data = await response.json();

  return data;
};
