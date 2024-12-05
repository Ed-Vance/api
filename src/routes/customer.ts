import { Router } from "express";
import { get, upsert } from "../controllers/customer";

const router = Router();

//at some point we need to decide how we want to do this...
//e.g. should we just say fuck it and have everything be a post request
//to allow for request bodies?
router.get("/", get);
router.post("/", upsert);

export default router;
