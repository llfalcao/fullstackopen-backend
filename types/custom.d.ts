declare namespace Express {
  export interface Request {
    token?: string;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    MONGODB_URI: string;
    TEST_MONGODB_URI: string;
    PORT: number;
    SECRET: string;
  }
}
