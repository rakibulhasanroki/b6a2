import express from "express";
import { authController } from "./auth.controllers";

import adminAuth from "../../middleware/adminAuth";

const router = express.Router();
// signup
router.post("/auth/signup", adminAuth(), authController.signupUser);
// login
router.post("/auth/signin", authController.loginUser);

export const authRoutes = router;
