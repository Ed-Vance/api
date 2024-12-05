import { Request, Response } from "express";

import { upsertCustomer } from "../services/customer";

function get(req: Request, res: Response) {
    //i have no use case for this right now.
    res.json({ message: "Hello from Example API!" });
}

function upsert(req: Request, res: Response) {
    //we need to validate the body - exactly how this body is formatted?? dunno yet - below seems reasonable
    const customer = upsertCustomer(req.body.customer);
    //use that customer id to create an admin user
    //const new_user = upsertUser(req.body.user);
    res.json({ customer });
}

export { get, upsert };
