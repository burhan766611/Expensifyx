import { prisma } from "../../config/db.js";

export const createAuditLog = async ({
  action,
  userId,
  orgId,
  metadata = {},
}) => {
  if (!userId || !orgId) return;

  await prisma.auditLog.create({
    data: {
      action,
      userId,
      orgId,
      metadata,
    },
  });
};
