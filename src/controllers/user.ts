import { Request, Response } from "express";

export const get = (req: Request, res: Response) => {
    //call users service in here.
    res.json({ message: "Hello from Example API!" });
};
