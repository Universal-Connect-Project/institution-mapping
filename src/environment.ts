export interface Config {
  AUTH0_AUDIENCE?: string;
  AUTH0_CLIENT_ID?: string;
  AUTH0_DOMAIN?: string;
  FINICITY_APP_KEY?: string;
  FINICITY_PARTNER_ID?: string;
  FINICITY_SECRET?: string;
  UCP_INSTITUTION_LIST_BASE_URL?: string;
  UCP_PASSWORD?: string;
  UCP_USERNAME?: string;
}

export const getConfig = (): Config => {
  return {
    AUTH0_AUDIENCE: "ucp-hosted-apps",
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    FINICITY_APP_KEY: process.env.FINICITY_APP_KEY,
    FINICITY_PARTNER_ID: process.env.FINICITY_PARTNER_ID,
    FINICITY_SECRET: process.env.FINICITY_SECRET,
    UCP_INSTITUTION_LIST_BASE_URL: process.env.UCP_INSTITUTION_LIST_BASE_URL,
    UCP_USERNAME: process.env.UCP_USERNAME,
    UCP_PASSWORD: process.env.UCP_PASSWORD,
  };
};
