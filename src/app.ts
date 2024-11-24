import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";

const app: Application = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api", routes);

export default app;
