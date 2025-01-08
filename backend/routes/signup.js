import { Router } from "express";
import { sendOtpController, verifyOtpController } from "../controllers/signup.js";

const router = Router();

router.post("/sendOTP", sendOtpController);

router.post("/verifyOTP", verifyOtpController);

export default router;