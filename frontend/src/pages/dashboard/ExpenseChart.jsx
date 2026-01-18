import React from 'react'
import MonthlySpendChart from './ExpenseChart/MonthlySpendChart';
import StatusPieChart from './ExpenseChart/StatusPieChart';
import CategorySpendChart from './ExpenseChart/CategorySpendChart';

const ExpenseChart = ({analytics}) => {
  // console.log(analytics)
  // console.log(analytics.monthAmount)
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <MonthlySpendChart data={analytics.totalMonthAmount} />

      <StatusPieChart
        pending={analytics.totalPending}
        approved={analytics.totalApproved}
        rejected={
          analytics.totalCount._all -
          analytics.totalPending -
          analytics.totalApproved
        }
      />

      <div className="lg:col-span-2">
        <CategorySpendChart data={analytics.categorySpend} />
      </div>
    </div>
    </>
  )
}

export default ExpenseChart
