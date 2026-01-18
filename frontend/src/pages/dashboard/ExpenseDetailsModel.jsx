import { motion } from "framer-motion";

const ExpenseDetailsModal = ({ expense, onClose }) => {
  if (!expense) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl w-full max-w-lg shadow-lg"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="text-lg font-semibold">Expense Details</h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-3 text-sm">
          <Detail label="Amount" value={`₹ ${expense.amount}`} />
          <Detail label="Category" value={expense.category} />
          <Detail label="Status" value={expense.status} />
          <Detail label="Description" value={expense.description || "—"} />
          <Detail
            label="Created At"
            value={new Date(expense.createdAt).toLocaleString()}
          />

          {expense.receiptUrl && (
            <div>
              <p className="font-medium text-gray-700 mb-1">Receipt</p>
              <a
                href={expense.receiptUrl}
                target="_blank"
                className="text-emerald-600 hover:underline"
              >
                View Receipt
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default ExpenseDetailsModal;

