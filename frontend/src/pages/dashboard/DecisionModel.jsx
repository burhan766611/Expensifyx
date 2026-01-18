import React, { useState } from "react";
import { motion } from "framer-motion";

const DecisionModel = ({
  expenseId,
  decisionType,
  open,
  onClose,
  onConfirm,
  type, // "APPROVED" | "REJECTED"
  loading = false,
}) => {
  const [comment, setComment] = useState("");
  if (!open) return null;
  const isApprove = type === "APPROVED";

  const handleSubmit = () => {
    onConfirm({
      expenseId,
      decision: decisionType,
      comment,
    });

    onClose();
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl w-full max-w-md shadow-lg"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              {isApprove ? "Approve Expense" : "Reject Expense"}
            </h2>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <p className="text-gray-600 mb-4">
              {isApprove
                ? "Are you sure you want to approve this expense?"
                : "Please confirm rejection of this expense."}
            </p>

            {!isApprove && (
              <textarea
                placeholder="Optional rejection comment"
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                rows={3}
                id="comment"
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              //   onClick={() => {
              //     const comment = document.getElementById("comment")?.value || "";
              //     onConfirm(comment);
              //   }}
              onClick={handleSubmit}
              disabled={loading}
              className={`px-4 py-2 text-sm rounded-lg text-white ${
                isApprove ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {loading ? "Processing..." : isApprove ? "Approve" : "Reject"}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default DecisionModel;
