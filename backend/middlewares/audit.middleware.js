import { createAuditLog } from "../src/utils/audit.js";

export const auditMiddleware = (req, res, next) => {
  req.audit = async (action, metadata = {}) => {
    if (!req.user) return;
    try {
      await createAuditLog({
        action,
        userId: req.user?.userId,
        orgId: req.user?.orgId,
        metadata,
      });
    } catch (err) {
      console.error("Audit log failed:", err.message);
    }
  };

  next();
};
