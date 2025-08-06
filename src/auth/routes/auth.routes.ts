import { Router } from "express";
import { login, signupSuperAdmin } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validateBody";

const router = Router();

router.post(
  "/signup/super-admin",
  validateBody(["email", "password", "displayName"]),
  signupSuperAdmin
);

router.post("/login", validateBody(["email", "password"]), login);

export default router;
