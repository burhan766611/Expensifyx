import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import expenseRoutes from "../modules/expenses/expenses.routes.js";
import inviteRoutes from "../modules/invites/invite.routes.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import auditRoutes from "../modules/audit/audit.routes.js"

const router = Router();

router.use("/auth", authRoutes);
router.use("/expenses", expenseRoutes);
router.use("/invites", inviteRoutes);
router.use("/audit", auditRoutes)

export default router;

