import { Router } from "express";
import { authControllers } from "./auth.controller.js";

const router = Router();

router.post("/signup", authControllers.signupUser);
router.post("/login", authControllers.loginUser);

export const authRouter = router;
