
export interface Expense {
  id: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  receiptUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface MonthlySpending {
  month: string;
  amount: number;
}

export interface CategoryTotal {
  category: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface ExpenseAnalytics {
  totalSpent: number;
  monthlySpendings: MonthlySpending[];
  categoryTotals: CategoryTotal[];
  recentTransactions: Expense[];
}

export interface ReceiptData {
  amount: number;
  date: string;
  vendor: string;
  category?: string;
  items?: { description: string; amount: number }[];
}
