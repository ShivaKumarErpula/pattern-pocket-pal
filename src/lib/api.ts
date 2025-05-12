
import { Budget, Category, Expense, ExpenseAnalytics, ReceiptData } from "@/types";
import { toast } from "sonner";

const API_URL = "https://x8ki-letl-twmt.n7.xano.io/api:your_api"; // Replace with your XANO API URL

// Mock data for development - will be replaced with actual API calls
const mockCategories: Category[] = [
  { id: "1", name: "Food & Dining", color: "#10B981" },
  { id: "2", name: "Transportation", color: "#3B82F6" },
  { id: "3", name: "Housing", color: "#8B5CF6" },
  { id: "4", name: "Entertainment", color: "#F59E0B" },
  { id: "5", name: "Shopping", color: "#EC4899" },
  { id: "6", name: "Utilities", color: "#6366F1" },
  { id: "7", name: "Healthcare", color: "#EF4444" },
  { id: "8", name: "Personal Care", color: "#14B8A6" },
  { id: "9", name: "Education", color: "#F97316" },
  { id: "10", name: "Other", color: "#6B7280" },
];

const mockExpenses: Expense[] = [
  {
    id: "1",
    amount: 42.75,
    date: "2024-05-10",
    category: "Food & Dining",
    description: "Grocery shopping",
  },
  {
    id: "2",
    amount: 35.00,
    date: "2024-05-09",
    category: "Transportation",
    description: "Uber ride",
  },
  {
    id: "3",
    amount: 1200.00,
    date: "2024-05-01",
    category: "Housing",
    description: "Monthly rent",
  },
  {
    id: "4",
    amount: 15.99,
    date: "2024-05-08",
    category: "Entertainment",
    description: "Netflix subscription",
  },
  {
    id: "5",
    amount: 85.43,
    date: "2024-05-07",
    category: "Shopping",
    description: "New clothes",
  },
  {
    id: "6",
    amount: 120.00,
    date: "2024-05-02",
    category: "Utilities",
    description: "Electricity bill",
  },
  {
    id: "7",
    amount: 50.00,
    date: "2024-05-05",
    category: "Healthcare",
    description: "Doctor appointment",
  },
  {
    id: "8",
    amount: 25.99,
    date: "2024-05-04",
    category: "Personal Care",
    description: "Haircut",
  },
];

const mockBudgets: Budget[] = [
  { id: "1", category: "Food & Dining", amount: 500, period: "monthly" },
  { id: "2", category: "Transportation", amount: 200, period: "monthly" },
  { id: "3", category: "Entertainment", amount: 100, period: "monthly" },
  { id: "4", category: "Shopping", amount: 150, period: "monthly" },
];

export const api = {
  // Expense CRUD operations
  getExpenses: async (): Promise<Expense[]> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockExpenses;
    } catch (error) {
      toast.error("Failed to fetch expenses");
      throw error;
    }
  },

  addExpense: async (expense: Omit<Expense, "id">): Promise<Expense> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const newExpense = {
        ...expense,
        id: Math.random().toString(36).substring(2, 9),
      };
      mockExpenses.unshift(newExpense);
      toast.success("Expense added successfully");
      return newExpense;
    } catch (error) {
      toast.error("Failed to add expense");
      throw error;
    }
  },

  updateExpense: async (expense: Expense): Promise<Expense> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const index = mockExpenses.findIndex((e) => e.id === expense.id);
      if (index >= 0) {
        mockExpenses[index] = expense;
        toast.success("Expense updated successfully");
        return expense;
      }
      throw new Error("Expense not found");
    } catch (error) {
      toast.error("Failed to update expense");
      throw error;
    }
  },

  deleteExpense: async (id: string): Promise<void> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const index = mockExpenses.findIndex((e) => e.id === id);
      if (index >= 0) {
        mockExpenses.splice(index, 1);
        toast.success("Expense deleted successfully");
        return;
      }
      throw new Error("Expense not found");
    } catch (error) {
      toast.error("Failed to delete expense");
      throw error;
    }
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockCategories;
    } catch (error) {
      toast.error("Failed to fetch categories");
      throw error;
    }
  },

  // Budget operations
  getBudgets: async (): Promise<Budget[]> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockBudgets;
    } catch (error) {
      toast.error("Failed to fetch budgets");
      throw error;
    }
  },

  addBudget: async (budget: Omit<Budget, "id">): Promise<Budget> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const newBudget = {
        ...budget,
        id: Math.random().toString(36).substring(2, 9),
      };
      mockBudgets.push(newBudget);
      toast.success("Budget added successfully");
      return newBudget;
    } catch (error) {
      toast.error("Failed to add budget");
      throw error;
    }
  },

  // Analytics
  getExpenseAnalytics: async (): Promise<ExpenseAnalytics> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate total spent
      const totalSpent = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Generate monthly spending data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlySpendings: MonthlySpending[] = months.map((month, index) => {
        const amount = Math.random() * 2000 + 500; // Random amount between 500 and 2500
        return { month, amount };
      });
      
      // Current month spending
      monthlySpendings[4].amount = totalSpent; // May is index 4
      
      // Calculate category totals
      const categoryMap = new Map<string, { amount: number; color: string }>();
      mockExpenses.forEach(expense => {
        const category = expense.category;
        const categoryInfo = mockCategories.find(c => c.name === category);
        const currentAmount = categoryMap.get(category)?.amount || 0;
        
        categoryMap.set(category, { 
          amount: currentAmount + expense.amount,
          color: categoryInfo?.color || "#6B7280"
        });
      });
      
      const categoryTotals: CategoryTotal[] = Array.from(categoryMap.entries()).map(([category, { amount, color }]) => ({
        category,
        amount,
        color,
        percentage: (amount / totalSpent) * 100,
      }));
      
      return {
        totalSpent,
        monthlySpendings,
        categoryTotals,
        recentTransactions: mockExpenses.slice(0, 5),
      };
    } catch (error) {
      toast.error("Failed to fetch analytics data");
      throw error;
    }
  },

  // AI features
  processReceiptImage: async (imageFile: File): Promise<ReceiptData> => {
    try {
      // Simulate OCR + NLP processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock receipt data extraction
      const mockReceiptData: ReceiptData = {
        amount: Math.floor(Math.random() * 100) + 10,
        date: new Date().toISOString().split('T')[0],
        vendor: "Local Store",
        category: mockCategories[Math.floor(Math.random() * mockCategories.length)].name,
        items: [
          { description: "Item 1", amount: Math.floor(Math.random() * 20) + 5 },
          { description: "Item 2", amount: Math.floor(Math.random() * 30) + 5 },
        ]
      };
      
      toast.success("Receipt processed successfully");
      return mockReceiptData;
    } catch (error) {
      toast.error("Failed to process receipt");
      throw error;
    }
  },

  getPredictiveBudgetSuggestions: async (): Promise<Budget[]> => {
    try {
      // Simulate AI budget suggestion
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock suggested budgets based on spending patterns
      return mockCategories.slice(0, 5).map(category => ({
        id: `suggested-${category.id}`,
        category: category.name,
        amount: Math.floor(Math.random() * 300) + 100,
        period: "monthly" as const,
      }));
    } catch (error) {
      toast.error("Failed to generate budget suggestions");
      throw error;
    }
  }
};
