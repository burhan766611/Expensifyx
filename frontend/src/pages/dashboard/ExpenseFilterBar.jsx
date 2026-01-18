import { useState } from "react";

const ExpenseFilterBar = ({
  filters,
  onChange,
  pageSize,
  onPageSizeChange,
  onReset,
}) => {
  return (
    <div className="bg-white border-[#1fc29f] rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-end">
      
      {/* Status */}
      <div>
        <label className="text-sm text-gray-600">Status</label>
        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
          className="block border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="text-sm text-gray-600">Category</label>
        <input
          type="text"
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value })}
          placeholder="Travel, Food..."
          className="block border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Date range */}
      <div>
        <label className="text-sm text-gray-600">From</label>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => onChange({ startDate: e.target.value })}
          className="block border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">To</label>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => onChange({ endDate: e.target.value })}
          className="block border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Amount range */}
      <div>
        <label className="text-sm text-gray-600">Min ₹</label>
        <input
          type="number"
          value={filters.minAmount}
          onChange={(e) => onChange({ minAmount: e.target.value })}
          className="block border rounded-lg px-3 py-2 text-sm w-28"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Max ₹</label>
        <input
          type="number"
          value={filters.maxAmount}
          onChange={(e) => onChange({ maxAmount: e.target.value })}
          className="block border rounded-lg px-3 py-2 text-sm w-28"
        />
      </div>

      {/* Page size */}
      <div>
        <label className="text-sm text-gray-600">Page size</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="block border rounded-lg px-3 py-2 text-sm"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="ml-auto text-sm px-4 py-2 rounded-lg border hover:bg-gray-100"
      >
        Reset
      </button>
    </div>
  );
};

export default ExpenseFilterBar;
