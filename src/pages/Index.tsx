
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Budget, Category, Expense, ExpenseAnalytics } from "@/types";
import DashboardSummary from "@/components/DashboardSummary";
import CategoryPieChart from "@/components/CategoryPieChart";
import MonthlyBarChart from "@/components/MonthlyBarChart";
import ExpenseList from "@/components/ExpenseList";
import ExpenseForm from "@/components/ExpenseForm";
import BudgetPlanner from "@/components/BudgetPlanner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRightIcon, CircleDollarSignIcon, ReceiptIcon } from "lucide-react";

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [analytics, setAnalytics] = useState<ExpenseAnalytics | null>(null);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editExpense, setEditExpense] = useState<Expense | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      setIsLoadingCategories(true);
      const categoriesData = await api.getCategories();
      setCategories(categoriesData);
      setIsLoadingCategories(false);

      // Fetch expenses
      setIsLoadingExpenses(true);
      const expensesData = await api.getExpenses();
      setExpenses(expensesData);
      setIsLoadingExpenses(false);

      // Fetch analytics
      setIsLoadingAnalytics(true);
      const analyticsData = await api.getExpenseAnalytics();
      setAnalytics(analyticsData);
      setIsLoadingAnalytics(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoadingCategories(false);
      setIsLoadingExpenses(false);
      setIsLoadingAnalytics(false);
    }
  };

  const handleAddExpense = async (expense: Omit<Expense, "id">) => {
    try {
      const newExpense = await api.addExpense(expense);
      setExpenses([newExpense, ...expenses]);
      fetchData(); // Refresh data
      return newExpense;
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const handleEditExpense = (expense: Expense) => {
    setEditExpense(expense);
    setActiveTab("add");
  };

  const handleCancelEdit = () => {
    setEditExpense(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CircleDollarSignIcon className="h-8 w-8 text-expense-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Pocket Pal</h1>
            </div>
            <div>
              <Button onClick={() => setActiveTab("add")} className="bg-expense-primary hover:bg-expense-primary/90">
                <ReceiptIcon className="h-5 w-5 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container py-6 px-4 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="add">Add Expense</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            {/* Dashboard Summary */}
            {analytics && (
              <DashboardSummary analytics={analytics} isLoading={isLoadingAnalytics} />
            )}
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analytics && (
                <>
                  <CategoryPieChart 
                    data={analytics.categoryTotals} 
                    isLoading={isLoadingAnalytics}
                  />
                  <MonthlyBarChart 
                    data={analytics.monthlySpendings} 
                    isLoading={isLoadingAnalytics}
                  />
                </>
              )}
            </div>
            
            {/* Recent Expenses */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ExpenseList
                  expenses={expenses}
                  categories={categories.map(c => c.name)}
                  isLoading={isLoadingExpenses}
                  onDelete={handleDeleteExpense}
                  onEdit={handleEditExpense}
                  onRefresh={fetchData}
                />
              </div>
              
              {/* Budget Planner */}
              <div>
                <BudgetPlanner
                  categories={categories}
                  isLoading={isLoadingCategories}
                />
              </div>
            </div>

            {/* AI Features Highlight */}
            <div className="expense-card mt-8">
              <h3 className="text-lg font-medium mb-4">AI-Powered Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-gradient-to-br from-expense-primary/10 to-expense-primary/5">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <span className="bg-expense-primary text-white p-1 rounded">1</span>
                    Receipt Recognition
                  </h4>
                  <p className="text-sm text-muted-foreground">Upload receipt images for automatic expense entry using OCR and NLP</p>
                  <Button variant="link" className="text-expense-primary p-0 h-auto mt-2" onClick={() => setActiveTab("add")}>
                    Try it now <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="p-4 rounded-lg border bg-gradient-to-br from-expense-secondary/10 to-expense-secondary/5">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <span className="bg-expense-secondary text-white p-1 rounded">2</span>
                    Spending Pattern Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground">AI analyzes your spending patterns and identifies trends and opportunities</p>
                  <Button variant="link" className="text-expense-secondary p-0 h-auto mt-2" disabled>
                    Coming soon <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="p-4 rounded-lg border bg-gradient-to-br from-expense-accent/10 to-expense-accent/5">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <span className="bg-expense-accent text-white p-1 rounded">3</span>
                    Smart Budget Suggestions
                  </h4>
                  <p className="text-sm text-muted-foreground">Get AI-powered budget recommendations based on your spending habits</p>
                  <Button variant="link" className="text-expense-accent p-0 h-auto mt-2" onClick={() => document.getElementById('budget-section')?.scrollIntoView({ behavior: 'smooth' })}>
                    Try it now <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="add">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <ExpenseForm
                  onAddExpense={handleAddExpense}
                  categories={categories}
                  isLoading={isLoadingCategories}
                  editExpense={editExpense}
                  onCancelEdit={handleCancelEdit}
                />
              </div>
              
              <div>
                <div className="expense-card">
                  <h3 className="text-lg font-medium mb-4">How It Works</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="bg-expense-primary/10 text-expense-primary font-medium rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Upload Receipt</h4>
                        <p className="text-sm text-muted-foreground">Upload a photo of your receipt for automatic data extraction</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="bg-expense-primary/10 text-expense-primary font-medium rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Verify Details</h4>
                        <p className="text-sm text-muted-foreground">Check and adjust the extracted information if needed</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="bg-expense-primary/10 text-expense-primary font-medium rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Save Expense</h4>
                        <p className="text-sm text-muted-foreground">Add the expense to track your spending</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <CircleDollarSignIcon className="h-5 w-5 text-expense-primary" />
              <span className="font-bold">Pocket Pal</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Powered by XANO Backend • &copy; {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
