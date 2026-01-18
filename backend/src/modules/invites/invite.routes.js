import { Router } from "express";
import * as controller from "./invite.controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { requireRole } from "../../../middlewares/rbac.middleware.js";
import { auditMiddleware } from "../../../middlewares/audit.middleware.js";

const router = Router();



// router.use(authMiddleware)
router.use(auditMiddleware)
router.post("/accept", controller.acceptInvite);
router.get("/validate", controller.validateInvite);

router.use(authMiddleware)

// Only OWNER / ADMIN can invite
router.post(
  "/",
  requireRole(["OWNER", "ADMIN"]),
  controller.createInvite
);

// Public (invite link)


router.get(
  "/",
  requireRole(["OWNER", "ADMIN"]),
  controller.listInvites
);

router.delete("/:id", 
  requireRole(["OWNER", "ADMIN"]),
  controller.deleteInvitation
)


export default router;
