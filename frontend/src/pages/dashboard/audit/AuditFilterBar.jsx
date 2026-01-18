const actions = [
  "",
  "EXPENSE_CREATED",
  "EXPENSE_APPROVED",
  "EXPENSE_REJECTED",
  "MEMBER_INVITED",
  "INVITE_ACCEPTED",
];

const AuditFilterBar = ({ filters, onChange, onReset }) => {
  return (
    <div className="bg-white p-4 rounded-xl flex flex-wrap gap-4 shadow-lg">
      <select
        value={filters.action}
        onChange={(e) => onChange({ action: e.target.value })}
        className="border rounded px-3 py-2"
      >
        <option value="">All Actions</option>
        {actions.map((a) => (
          <option key={a} value={a}>
            {a.replaceAll("_", " ")}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={filters.startDate}
        onChange={(e) => onChange({ startDate: e.target.value })}
        className="border rounded px-3 py-2"
      />

      <input
        type="date"
        value={filters.endDate}
        onChange={(e) => onChange({ endDate: e.target.value })}
        className="border rounded px-3 py-2"
      />

      <button
        onClick={onReset}
        className="px-4 py-2 border rounded"
      >
        Reset
      </button>
    </div>
  );
};

export default AuditFilterBar;
