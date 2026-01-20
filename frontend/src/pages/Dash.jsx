import React, { useState, useEffect } from "react";
import api from "../api/axios.js";
import TopBar from "./dashboard/TopBar.jsx";
import ExpensesTable from "./dashboard/ExpensesTable.jsx";
import AnalyticsGrid from "./dashboard/AnalyticsGrid.jsx";
import ExpenseFilterBar from "./dashboard/ExpenseFilterBar.jsx";
import InviteMemberPanel from "./Invite/InviteMemberPanel.jsx";
import PendingInvites from "./Invite/PendingInvites.jsx";
import ExpenseChart from "./dashboard/ExpenseChart.jsx";
import AuditFeed from "./dashboard/audit/AuditFeed.jsx";

const Dash = () => {
  const [stats, setStats] = useState({
    totalAmount: "",
    totalCount: "",
    monthAmount: "",
    pendingCount: "",
    approvedCount: "",
  });
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingExpense, setLoadingExpense] = useState(false);

  const [inviteOpen, setInviteOpen] = useState(false);

  const getStats = (analytics) => {
      console.log("Analytics : ", analytics);
      console.log("Analytics totalamount : ", analytics.totalAmount.amount);
    setStats({
      totalAmount: analytics.totalAmount?.amount || 0,
      totalCount: analytics.totalCount?._all || 0,
      monthAmount: analytics.totalMonthAmount?.[0]?.monthly_sum || 0,
      pendingCount: analytics.totalPending || 0,
      approvedCount: analytics.totalApproved || 0,
    });
  };

  const fetchExpenses = async () => {
    setLoadingExpense(true);
    try {
      const res = await api.get("/expenses", {
        params: { ...filters, page, limit },
      });
      console.log(res.data);

      setExpenses(res.data.data);
      setTotalPages(res.data.meta.totalPages);
      getStats(res.data.analytics);
    } finally {
      setLoadingExpense(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters, page, limit]);

  const handleFilterChange = (changed) => {
    setFilters((prev) => ({ ...prev, ...changed }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      category: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });
    setPage(1);
  };

  console.log(stats);

  return (
    <>
      <TopBar onInvite={() => setInviteOpen(true)} />

      <InviteMemberPanel
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSuccess={() => {}}
      />
      <div className="p-6 space-y-8 bg-[url(/bg.png)]">
        {stats ? (
          <>
            <AnalyticsGrid stats={stats} />
          </>
        ) : (
          <p className="text-gray-500">Loading analytics...</p>
        )}
         {/* <ExpenseChart analytics={stats} /> */}
        {/* 
        <ExpenseFilterBar
          filters={filters}
          onChange={handleFilterChange}
          pageSize={limit}
          onPageSizeChange={(size) => {
            setLimit(size);
            setPage(1);
          }}
          onReset={resetFilters}
        />
        <ExpensesTable
          expenses={expenses}
          loadingExpense={loadingExpense}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          limit={limit}
          onLimitChange={(newLimit) => {
            setPage(1); // 🔥 reset page
            setLimit(newLimit);
          }}
        />
        <PendingInvites />
        <AuditFeed /> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT — Main Work Area */}
          <div className="lg:col-span-2 space-y-6">
            <ExpenseFilterBar
              filters={filters}
              onChange={handleFilterChange}
              pageSize={limit}
              onPageSizeChange={(size) => {
                setLimit(size);
                setPage(1);
              }}
              onReset={resetFilters}
            />

            <ExpensesTable
              expenses={expenses}
              loadingExpense={loadingExpense}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              limit={limit}
              onLimitChange={(newLimit) => {
                setPage(1);
                setLimit(newLimit);
              }}
            />

            <PendingInvites />
          </div>

          {/* RIGHT — Audit Feed */}
          <div className="lg:col-span-1">
            <AuditFeed />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dash;

  // const getStats = (data) => {
  //   setStats({
  //       totalAmount: data.totalAmount.amount,
  //       totalCount: data.totalCount._all,
  //       monthAmount : data.totalMonthAmount[0].monthly_sum,
  //       pendingCount: data.totalPending,
  //       approvedCount: data.totalApproved
  //   })
  // }