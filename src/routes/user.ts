import { Router } from "express";
import { get } from "../controllers/user";

const router = Router();

router.get("/", get);

export default router;
