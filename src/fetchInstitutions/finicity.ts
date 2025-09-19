import {
  FINICITY_APP_KEY,
  FINICITY_PARTNER_ID,
  FINICITY_SECRET,
} from "../environment";

const fetchAccessToken = async () => {
  if (!FINICITY_APP_KEY || !FINICITY_PARTNER_ID || !FINICITY_SECRET) {
    throw new Error("Missing Finicity environment variables");
  }

  const authResponse = await fetch(
    "https://api.finicity.com/aggregation/v2/partners/authentication",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "finicity-app-key": FINICITY_APP_KEY,
      },
      body: JSON.stringify({
        partnerId: FINICITY_PARTNER_ID,
        partnerSecret: FINICITY_SECRET,
      }),
    }
  );

  if (!authResponse.ok) {
    throw new Error(
      `Failed to authenticate with Finicity: ${authResponse.statusText}`
    );
  }

  const { token } = await authResponse.json();

  return token;
};

export const fetchInstitutions = async () => {
  await fetchAccessToken();
};
