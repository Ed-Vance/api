import { Request, Response, RequestHandler } from 'express';
import * as authService from '../services/authService';

export const login: RequestHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    const authResult = await authService.checkUserCredentials(email, password);
    if (authResult) {
      const { user, token } = authResult;
      res.json({ message: 'Successful', user, token });
    } else {
      res.status(401).json({ error: 'Invalid' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
