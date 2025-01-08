import { Router } from "express";
import signinController from "../controllers/signin.js";

const router = Router();

router.post("/", signinController);

export default router;