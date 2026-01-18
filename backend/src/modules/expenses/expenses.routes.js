import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware.js"
import { auditMiddleware } from "../../../middlewares/audit.middleware.js";
import { requireRole } from "../../../middlewares/rbac.middleware.js";
import * as controller from "../expenses/expenses.controller.js"

const router = Router();

router.use(authMiddleware);
router.use(auditMiddleware);

router.post("/", controller.createExpense);
router.get("/", controller.listExpenses);
// router.get("/analytics", controller.analytics);
router.get("/:id", controller.getExpense);
router.put("/:id", controller.updateExpense);
            
router.delete(
  "/:id",
  requireRole(["OWNER", "ADMIN"]),
  controller.deleteExpense
);

router.post(
  "/:id/decision",
  requireRole(["OWNER", "ADMIN", "MANAGER"]),
  controller.decideExpense
);

router.post(
  "/",
  authMiddleware,
  requireRole(["OWNER", "ADMIN", "MANAGER"]),
  (req, res) => {
    res.json({
      message: "Expense created",
      user: req.user,
    });
  }
);

export default router;
