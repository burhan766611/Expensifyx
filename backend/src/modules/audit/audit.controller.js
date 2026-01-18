import * as service from "./audit.service.js"

export const getAuditFeed = async (req, res) => {
  try {
    console.log("Req user : ", req.user);
    console.log("Req Query : ", req.query);
    const result = await service.getAuditFeed(req.query, req.user);
    res.json(result);
  } catch (err) {
    console.error("Audit feed error:", err);
    res.status(400).json({ message: err.message });
  }
};

export const listAuditLogs = async (req, res) => {
  try {
    const {
      action,
      userId,
      startDate,
      endDate,
      page = 1,
      limit = 15,
    } = req.query;

    const where = {
      orgId: req.user.orgId,
    };

    // 🔐 Role-based visibility
    if (req.user.role === "MEMBER") {
      where.userId = req.user.userId;
    }

    // Filters
    if (action) where.action = action;
    if (userId) where.userId = userId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: { name: true, email: true, role: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({
      data: logs,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
