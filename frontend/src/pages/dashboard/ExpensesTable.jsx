import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import DecisionModel from "./DecisionModel";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { useEffect } from "react";
import ExpenseDetailsModal from "./ExpenseDetailsModel";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const rolePermissions = {
  OWNER: {
    showDescription: true,
    showReceipt: true,
    canApprove: true,
  },
  ADMIN: {
    showDescription: true,
    showReceipt: true,
    canApprove: true,
  },
  MANAGER: {
    showDescription: true,
    showReceipt: true,
    canApprove: false,
  },
  MEMBER: {
    showDescription: false,
    showReceipt: false,
    canApprove: false,
  },
};

const ExpensesTable = ({
  expenses,
  loadingExpense,
  page,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
}) => {
  const { user } = useContext(AuthContext);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [decisionType, setDecisionType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allExpenses, setAllExpenses] = useState([]);
  const [viewExpense, setViewExpense] = useState(null);

  useEffect(() => {
    if (expenses && expenses.length) {
      setAllExpenses(expenses);
    }
  }, [expenses]);

  if (!user) {
    return (
      <div className="bg-white rounded-xl p-6 text-gray-500">
        Loading expenses...
      </div>
    );
  }

  const permissions = rolePermissions[user.role];

  const handleDecision = async ({ expenseId, decision, comment }) => {
    setLoading(true);

    // optimistic snapshot
    const previousExpenses = [...expenses];

    // optimistic UI update
    setAllExpenses((prev) =>
      prev.map((exp) =>
        exp.id === expenseId ? { ...exp, status: decision } : exp
      )
    );

    try {
      await api.post(
        `/expenses/${expenseId}/decision`,
        { decision, comment },
        { withCredentials: true }
      );

      setSelectedExpense(null);
      setDecisionType(null);
    } catch (err) {
      console.error(err.response?.data || err);

      // rollback
      setAllExpenses(previousExpenses);
      alert("Action failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isPdf = (url) => url?.endsWith(".pdf");

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    if (page <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (page >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }

    return pages;
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Expenses</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Category</th>

                {permissions.showDescription && (
                  <th className="px-6 py-3 text-left">Description</th>
                )}

                {permissions.showReceipt && (
                  <th className="px-6 py-3 text-left">Receipt</th>
                )}

                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Details</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {allExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">₹ {expense.amount}</td>

                  <td className="px-6 py-4">{expense.category}</td>

                  {permissions.showDescription && (
                    <td className="px-6 py-4 text-gray-600">
                      {expense.description || "-"}
                    </td>
                  )}

                  {/* {permissions.showReceipt && (
                    <td className="px-6 py-4">
                      {expense.receiptUrl ? (
                        <a
                          href={expense.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  )} */}
                  {permissions.showReceipt && (
                    <td className="px-6 py-4">
                      {/* {expense.receiptUrl ? (
                        <a
                          href={expense.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline font-medium"
                        >
                          View Receipt
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )} */}

                      {expense.receiptUrl &&
                        (isPdf(expense.receiptUrl) ? (
                          <a
                            href={expense.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 underline"
                          >
                            View Receipt
                          </a>
                        ) : (
                          <a
                            href={expense.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={expense.receiptUrl}
                              alt="Receipt"
                              className="h-16 rounded border"
                            />
                          </a>
                        ))}
                    </td>
                  )}

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusStyles[expense.status]
                      }`}
                    >
                      {expense.status}
                    </span>
                  </td>
                  <td className="pr-3 py-4 text-right space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setViewExpense(expense)}
                    >
                      Details
                    </button>
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    {/* {permissions.canApprove && expense.status === "PENDING" && (
                      <>
                        <button
                          className="text-green-600 hover:underline"
                          onClick={() => {
                            console.log(expense.id);
                            setSelectedExpense(expense.id);
                            setDecisionType("APPROVED");
                          }}
                        >
                          Approve
                        </button>

                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => {
                            setSelectedExpense(expense.id);
                            setDecisionType("REJECTED");
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )} */}
                    {permissions.canApprove && expense.status === "PENDING" && (
                      <>
                        <button
                          disabled={loading}
                          onClick={() => {
                            setSelectedExpense(expense.id);
                            setDecisionType("APPROVED");
                          }}
                          className="bg-green-500 text-white p-2 rounded-lg"
                        >
                          Approve
                        </button>

                        <button
                          disabled={loading}
                          onClick={() => {
                            setSelectedExpense(expense.id);
                            setDecisionType("REJECTED");
                          }}
                          className="bg-red-600 text-white p-2 rounded-lg"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={limit}
                disabled={loadingExpense}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>

            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                disabled={page === 1 || loadingExpense}
                onClick={() => onPageChange(page - 1)}
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
              >
                Prev
              </button>

              {/* Page numbers */}
              {getPageNumbers().map((p, idx) =>
                p === "..." ? (
                  <span key={idx} className="px-2 text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    disabled={loadingExpense}
                    className={`px-3 py-1 text-sm border rounded-lg
            ${
              p === page
                ? "bg-emerald-600 text-white border-emerald-600"
                : "hover:bg-gray-100"
            }`}
                  >
                    {p}
                  </button>
                )
              )}

              {/* Next */}
              <button
                disabled={page === totalPages || loadingExpense}
                onClick={() => onPageChange(page + 1)}
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <DecisionModel
            expenseId={selectedExpense}
            open={!!selectedExpense}
            type={decisionType}
            decisionType={decisionType}
            loading={loading}
            onClose={() => {
              setSelectedExpense(null);
              setDecisionType(null);
            }}
            onConfirm={handleDecision}
          />
          <ExpenseDetailsModal
            expense={viewExpense}
            onClose={() => setViewExpense(null)}
          />
        </div>
      </div>
    </>
  );
};

export default ExpensesTable;

{
  /* <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Expenses</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {expenses.map(expense => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">
                  ₹ {expense.amount}
                </td>

                <td className="px-6 py-4">
                  {expense.category}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[expense.status]}`}
                  >
                    {expense.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {new Date(expense.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-emerald-600 hover:underline">
                    View
                  </button>

                  {(user.role === "OWNER" || user.role === "ADMIN") &&
                    expense.status === "PENDING" && (
                      <>
                        <button className="text-green-600 hover:underline">
                          Approve
                        </button>
                        <button className="text-red-600 hover:underline">
                          Reject
                        </button>
                      </>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div> */
}
