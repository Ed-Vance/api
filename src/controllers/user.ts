import { Request, Response } from "express";

export const get = (req: Request, res: Response) => {
  res.json({ message: "Hello from Example API!" });
};
