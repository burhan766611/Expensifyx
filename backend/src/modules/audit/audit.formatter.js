export const formatAudit = (log) => {
  const actor = log.user?.name || "System";

  let message = "";

  switch (log.action) {
    case "EXPENSE_CREATED":
      message = `${actor} created an expense`;
      break;

    case "EXPENSE_APPROVED":
      message = `${actor} approved an expense`;
      break;

    case "EXPENSE_REJECTED":
      message = `${actor} rejected an expense`;
      break;

    case "INVITE_SENT":
      message = `${actor} sent an invite`;
      break;

    case "USER_LOGIN":
      message = `${actor} logged in`;
      break;

    default:
      message = log.action.replace(/_/g, " ").toLowerCase();
  }

  return {
    id: log.id,
    action: log.action,
    message,
    metadata: log.metadata,
    createdAt: log.createdAt,
    user: log.user,
  };
};
