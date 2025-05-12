
import { ExpenseAnalytics } from "@/types";
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon, WalletIcon } from "lucide-react";

interface DashboardSummaryProps {
  analytics: ExpenseAnalytics;
  isLoading: boolean;
}

const DashboardSummary = ({ analytics, isLoading }: DashboardSummaryProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="expense-card animate-pulse flex flex-col gap-2">
            <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Mock data for UI elements that need computed values
  const monthlyChange = 12.5; // Percentage change from last month
  const projectedSpending = analytics.totalSpent * 1.1; // 10% more than current
  const savingsOpportunity = analytics.totalSpent * 0.15; // 15% of current spending

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="expense-card dashboard-stat bg-gradient-to-br from-expense-primary/10 to-expense-primary/5">
        <div className="flex justify-between items-center">
          <span className="stat-label">Total Spending</span>
          <WalletIcon className="h-5 w-5 text-expense-primary" />
        </div>
        <div className="stat-value text-expense-dark">
          ${analytics.totalSpent.toFixed(2)}
        </div>
        <div className="text-xs flex items-center gap-1">
          <span className={`${monthlyChange > 0 ? "text-expense-danger" : "text-expense-primary"} font-medium flex items-center`}>
            {monthlyChange > 0 ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
            {Math.abs(monthlyChange)}%
          </span>
          <span className="text-gray-500">vs last month</span>
        </div>
      </div>
      
      <div className="expense-card dashboard-stat bg-gradient-to-br from-expense-secondary/10 to-expense-secondary/5">
        <div className="flex justify-between items-center">
          <span className="stat-label">Top Category</span>
          <div className="h-5 w-5 rounded-full" style={{ backgroundColor: analytics.categoryTotals[0]?.color || "#10B981" }} />
        </div>
        <div className="stat-value text-expense-dark">
          {analytics.categoryTotals[0]?.category || "No data"}
        </div>
        <div className="text-xs flex items-center gap-1 text-gray-500">
          ${analytics.categoryTotals[0]?.amount.toFixed(2) || "0.00"} ({analytics.categoryTotals[0]?.percentage.toFixed(1) || "0"}%)
        </div>
      </div>
      
      <div className="expense-card dashboard-stat bg-gradient-to-br from-expense-accent/10 to-expense-accent/5">
        <div className="flex justify-between items-center">
          <span className="stat-label">Projected Spending</span>
          <TrendingUpIcon className="h-5 w-5 text-expense-accent" />
        </div>
        <div className="stat-value text-expense-dark">
          ${projectedSpending.toFixed(2)}
        </div>
        <div className="text-xs text-gray-500">
          Based on your current habits
        </div>
      </div>
      
      <div className="expense-card dashboard-stat bg-gradient-to-br from-expense-warning/10 to-expense-warning/5">
        <div className="flex justify-between items-center">
          <span className="stat-label">Savings Opportunity</span>
          <WalletIcon className="h-5 w-5 text-expense-warning" />
        </div>
        <div className="stat-value text-expense-dark">
          ${savingsOpportunity.toFixed(2)}
        </div>
        <div className="text-xs text-gray-500">
          Potential monthly savings
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
