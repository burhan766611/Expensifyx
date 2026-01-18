import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { requireRole } from "../../../middlewares/rbac.middleware.js";
import * as controller from "./audit.controller.js";

const router = Router();

router.use(authMiddleware);

// OWNER & ADMIN see everything
router.get(
  "/",
  requireRole(["OWNER", "ADMIN", "MANAGER"]),
  controller.getAuditFeed
);

router.get(
  "/",
  authMiddleware,
  requireRole(["OWNER", "ADMIN", "MANAGER", "MEMBER"]),
  controller.listAuditLogs
);

export default router;
