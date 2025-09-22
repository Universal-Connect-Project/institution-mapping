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

const pageSize = 1000;

const fetchInstitutionPage = async ({
  page,
  token,
}: {
  page: number;
  token: string;
}) => {
  const response = await fetch(
    `https://api.finicity.com/institution/v2/institutions?start=${page}&limit=${pageSize}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "finicity-app-key": FINICITY_APP_KEY!,
        "finicity-app-token": token,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch institutions from Finicity: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
};

export const fetchFinicityInstitutions = async () => {
  const token = await fetchAccessToken();

  const page1 = await fetchInstitutionPage({ page: 1, token });
  const { found, institutions: page1Institutions } = page1;

  const institutions = [...page1Institutions];

  const numberOfPages = Math.ceil(found / pageSize);

  for (let page = 2; page < numberOfPages + 1; page++) {
    const { institutions: currentPageInstitutions, displaying } =
      await fetchInstitutionPage({ page, token });

    institutions.push(...currentPageInstitutions);
  }

  console.log(`Fetched ${institutions.length} institutions from Finicity`);

  return institutions;
};
