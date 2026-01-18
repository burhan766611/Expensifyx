import api from "../api/axios";

export default function ExpenseCard({ expense, canApprove, onDecision }) {


  const decide = async (decision) => {
    await api.post(`/expenses/${expense.id}/decision`, {
      decision,
    });
    onDecision(expense.id, decision);
  };

  return (
    <div className="border p-3 rounded mb-2">
      <div className="flex justify-between">
        <div>
          <b>{expense.category}</b>
          <p className="text-sm text-gray-500">
            ${expense.amount}
          </p>
        </div>

        <span className="text-sm">{expense.status}</span>
      </div>

      {canApprove && expense.status === "PENDING" && (
        <div className="flex gap-2 mt-3">
          <button
            className="btn bg-green-600"
            onClick={() => decide("APPROVED")}
          >
            Approve
          </button>
          <button
            className="btn bg-red-600"
            onClick={() => decide("REJECTED")}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
