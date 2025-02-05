import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

export const authenticateJWT: RequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header missing.' });
    return;
  }

  const token = authHeader.split(' ')[1]; // Expecting format "Bearer <token>"

  if (!token) {
    res.status(401).json({ error: 'Token missing.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      user_id: number;
      email: string;
      first_name: string;
      last_name: string;
      iat: number;
      exp: number;
    };

    req.user = {
      user_id: decoded.user_id,
      email: decoded.email,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
    };

    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};
