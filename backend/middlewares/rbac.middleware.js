import { prisma } from "../config/db.js";

export const requireRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    const { userId, orgId } = req.user;

    const member = await prisma.orgMember.findUnique({
      where: {
        userId_orgId: {
          userId,
          orgId,
        },
      },
    });

    if (!member) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!allowedRoles.includes(member.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    req.user.role = member.role;
    next();
  };
};
