import { Router } from "express";
import User from "./user";

//can probably do some abstraction eventually
const router = Router();

router.use("/user", User);

export default router;
