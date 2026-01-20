import React from 'react'
import AnalyticsCard from './AnalyticsCard'

const AnalyticsGrid = ({ stats }) => {
  console.log(stats);
  return (
    <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnalyticsCard
        title="Total Expenses"
        value={`₹ ${stats.totalAmount}`}
        subtitle={`${stats.totalCount} records`}
        color="text-gray-500"
      />

      <AnalyticsCard
        title="This Month"
        value={`₹ ${stats.monthAmount}`}
        subtitle="Current month"
        color="text-blue-600"
      />

      <AnalyticsCard
        title="Pending Approvals"
        value={stats.pendingCount}
        subtitle="Needs action"
        color="text-orange-600"
      />

      <AnalyticsCard
        title="Approved"
        value={stats.approvedCount}
        subtitle="All time"
        color="text-green-600"
      />
    </div>
    </>
  )
}

export default AnalyticsGrid
