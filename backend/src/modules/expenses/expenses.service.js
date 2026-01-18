import { prisma } from "../../../config/db.js";

export const createExpense = async (data, user) => {
  return prisma.expense.create({
    data: {
      amount: data.amount,
      category: data.category,
      description: data.description,
      receiptUrl: data.receiptUrl, // ✅ matches Prisma
      userId: user.userId,
      orgId: user.orgId,
    },
  });
};

// export const getExpenses = async (id, user) => {
//     return prisma.expense.findMany({
//         where: { orgId: user.orgId },
//         orderBy: { createdAt: "desc" },
//     })
// };

export const getExpenses = async (query, user) => {
  const orgId = user.orgId;
  const {
    page = 1,
    limit = 10,
    status,
    category,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    sortBy = "createdAt",
    order = "desc",
  } = query;

  const where = {
    orgId: user.orgId,
  };

  // Filters
  if (status) where.status = status;
  if (category) where.category = category;

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  if (minAmount || maxAmount) {
    where.amount = {};
    if (minAmount) where.amount.gte = Number(minAmount);
    if (maxAmount) where.amount.lte = Number(maxAmount);
  }

  const skip = (Number(page) - 1) * Number(limit);
  console.log("where : ", where);
  const [
    items,
    total,
    aggregates,
    statusGroups,
    rawData,
    monthAmount,
    categorySpend,
  ] = await Promise.all([
    prisma.expense.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: {
        [sortBy]: order,
      },
    }),
    prisma.expense.count({ where }),
    prisma.expense.aggregate({
      where,
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.expense.groupBy({
      where: { orgId, status: { in: ["PENDING", "APPROVED"] } },
      by: ["status"],
      _count: { status: true },
    }),
    prisma.expense.findMany({
      where: { orgId },
      select: { createdAt: true },
      distinct: ["createdAt"],
    }),
    prisma.$queryRaw`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM') AS month_key, 
        SUM("amount")::FLOAT AS monthly_sum
      FROM "Expense"
      WHERE "orgId" = ${orgId}
      GROUP BY month_key
      ORDER BY month_key DESC
    `,
    prisma.expense.groupBy({
      where,
      by: ["category"],
      _sum: { amount: true },
    }),
  ]);

  return {
    data: items,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
    analytics: {
      totalAmount: aggregates._sum || 0,
      totalCount: aggregates._count,
      totalPending:
        statusGroups.find((g) => g.status === "PENDING")?._count.status || 0,
      totalApproved:
        statusGroups.find((g) => g.status === "APPROVED")?._count.status || 0,
      totalMonthCount: new Set(
        rawData.map(
          (d) => `${d.createdAt.getUTCFullYear()}-${d.createdAt.getUTCMonth()}`
        )
      ).size,
      totalMonthAmount: monthAmount,
      categorySpend: categorySpend.map((c) => ({
        category: c.category,
        total: c._sum.amount || 0,
      })),
    },
  };
};

// export const analytics = async

export const getExpenseById = async (id, user) => {
  const expense = await prisma.expense.findFirst({
    where: {
      id,
      orgId: user.orgId,
    },
    include: { expenseApprovals: true },
  });

  if (!expense) throw new Error("Expense not found");
  return expense;
};

export const updateExpense = async (id, data, user) => {
  const expense = await prisma.expense.findUnique({ where: { id } });

  if (!expense || expense.orgId !== user.orgId) {
    throw new Error("Not allowed");
  }

  if (expense.userId !== user.userId) {
    throw new Error("Only creator can update expense");
  }

  return prisma.expense.update({
    where: { id },
    data,
  });
};

export const deleteExpense = async (id, user) => {
  const expense = await prisma.expense.findUnique({ where: { id } });

  if (!expense || expense.orgId !== user.orgId) {
    throw new Error("Not allowed");
  }

  return prisma.expense.delete({ where: { id } });
};

// export const decideExpense = async (id, decisionData, user) => {
//   const expense = await prisma.expense.findFirst({
//     where: { id, orgId: user.orgId, status:"PENDING" },
//   });
//   console.log("expense", expense)

//   if (!expense) throw new Error("Expense not found");

//   return prisma.expenseApproval.create({
//     data: {
//       expenseId: id,
//       approvedById: user.userId,
//       decision: decisionData.decision,
//       comment: decisionData.comment,
//     },
//   });
// };

// export const decideExpense = async (id, decisionData, user) => {
//   const expense = await prisma.expense.findFirst({
//     where: { id, orgId: user.orgId, status: "PENDING" },
//   });

//   if (!expense) throw new Error("Expense not found or already decided");

//   return prisma.$transaction(async (tx) => {
//     const approval = await tx.expenseApproval.create({
//       data: {
//         expenseId: id,
//         approvedById: user.userId,
//         decision: decisionData.decision,
//         comment: decisionData.comment,
//       },
//     });

//     await tx.expense.update({
//       where: { id },
//       data: {
//         status: decisionData.decision,
//       },
//     });

//     return approval;
//   });
// };

export const decideExpense = async (id, decisionData, user) => {
  const expense = await prisma.expense.findFirst({
    where: {
      id,
      orgId: user.orgId,
      status: "PENDING",
    },
  });

  if (!expense) {
    throw new Error("Expense not found or already decided");
  }

  // 🔴 CHECK EXISTING APPROVAL
  const existingApproval = await prisma.expenseApproval.findUnique({
    where: {
      expenseId_approvedById: {
        expenseId: id,
        approvedById: user.userId,
      },
    },
  });

  if (existingApproval) {
    throw new Error("You have already reviewed this expense");
  }

  // ✅ CREATE APPROVAL
  const approval = await prisma.expenseApproval.create({
    data: {
      expenseId: id,
      approvedById: user.userId,
      decision: decisionData.decision,
      comment: decisionData.comment,
    },
  });

  // ✅ UPDATE EXPENSE STATUS
  await prisma.expense.update({
    where: { id },
    data: {
      status: decisionData.decision,
    },
  });

  return approval;
};
