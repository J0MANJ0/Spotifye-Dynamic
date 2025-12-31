import '@clerk/express';

declare global {
  namespace Express {
    interface AuthObject {
      userId?: string | null;
      sessionId?: string | null;
      getToken?: (opts?: { template?: string }) => Promise<string | null>;
    }

    interface Request {
      auth: AuthObject;
    }
  }
}

export {};
