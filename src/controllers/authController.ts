import { Request, Response, RequestHandler } from 'express';
import * as authService from '../services/authService';
 
export const login: RequestHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Confirm input validity
  if (!email || !password) {
    res.status(400).json({ error: 'Error Parsing' });
    return;
  }

  const user = await authService.checkUserCredentials(email, password);
  if (user) {
    res.json({ message: 'Successful', user });
  } else {
    res.status(401).json({ error: 'Invalid' });
  }
};
