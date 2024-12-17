import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();

import usersRoutes from './routes/usersRoutes';
import clientsRoutes from './routes/clientsRoutes';
import clientAccountsRoutes from './routes/clientAccountsRoutes';
import classesRoutes from './routes/classesRoutes';
import classUsersRoutes from './routes/classUsersRoutes';
import environmentRoutes from './routes/environmentRoutes';
import environmentHistoryRoutes from './routes/environmentHistoryRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateJWT } from './middleware/authMiddleware';

const app: Application = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/auth', authRoutes);

// Protected Routes
app.use(authenticateJWT);
app.use('/users', usersRoutes); 
app.use('/clients', clientsRoutes);
app.use('/client-accounts', clientAccountsRoutes);
app.use('/classes', classesRoutes);
app.use('/class-users', classUsersRoutes);
app.use('/environments', environmentRoutes);
app.use('/environment-history', environmentHistoryRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

export default app;
