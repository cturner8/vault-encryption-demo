declare namespace NodeJS {
  export interface ProcessEnv {
    JWT_SECRET: string;
    JWT_EXPIRY: string;
    JWT_AUDIENCE: string;
    JWT_ISSUER: string;
  }
}
