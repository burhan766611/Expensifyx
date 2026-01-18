import ExpenseCard from "./ExpenseCard";

export default function ExpenseList({
  expenses,
  canApprove,
  onDecision,
}) {
  return (
    <div>
      {expenses.map((e) => (
        <ExpenseCard
          key={e.id}
          expense={e}
          canApprove={canApprove}
          onDecision={onDecision}
        />
      ))}
    </div>
  );
}
