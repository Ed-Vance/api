import { Router } from "express";
import User from "./src/user";

const router = Router();

router.use("/user", User);

export default router;
