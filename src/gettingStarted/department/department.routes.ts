import { Router } from "express";
import { addDepartment, fetchDepartments } from "./department.controller";
import { authorizeRole } from "../../auth/middlewares/authorizeRole";
import { validateBody } from "../../auth/middlewares/validateBody";
import { UserRole } from "../../auth/constants/roles";
import { authenticateFirebaseUser } from "../../auth/middlewares/authenticateFirebaseUser";

const router = Router();

// Super Admin only - Add department
router.post(
  "/",
  authenticateFirebaseUser,
  authorizeRole(UserRole.SUPER_ADMIN),
  validateBody(["name", "code", "status"]),
  addDepartment
);

// Public / All Authenticated - Get all departments
router.get("/", authenticateFirebaseUser, fetchDepartments);

export default router;
