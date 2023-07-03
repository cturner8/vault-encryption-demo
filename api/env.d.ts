declare namespace NodeJS {
  export interface ProcessEnv {
    JWT_SECRET: string;
    JWT_EXPIRY: string;
    JWT_AUDIENCE: string;
    JWT_ISSUER: string;
    VAULT_ADDR: string;
    VAULT_APP_TOKEN: string;
    VAULT_KEY_NAME: string;
  }
}
