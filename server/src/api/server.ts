// api/index.ts
import { Request, Response } from 'express';
import app from '../app'; // Import your main Express app (from src/app.ts or wherever)

// Optional: Add root route for testing
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'API is live on Vercel!' });
});

export default app;
