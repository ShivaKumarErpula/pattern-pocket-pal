
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { api } from "@/lib/api";
import { Budget, Category } from "@/types";
import { CheckCircle2Icon, PlusCircleIcon, SparklesIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface BudgetPlannerProps {
  categories: Category[];
  isLoading: boolean;
}

const BudgetPlanner = ({ categories, isLoading }: BudgetPlannerProps) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [open, setOpen] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [newBudgetPeriod, setNewBudgetPeriod] = useState<"monthly" | "weekly" | "yearly">("monthly");
  const [suggestedBudgets, setSuggestedBudgets] = useState<Budget[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isFetchingBudgets, setIsFetchingBudgets] = useState(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setIsFetchingBudgets(true);
      const data = await api.getBudgets();
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setIsFetchingBudgets(false);
    }
  };

  const handleAddBudget = async () => {
    try {
      const newBudget: Omit<Budget, "id"> = {
        category: newBudgetCategory,
        amount: parseFloat(newBudgetAmount),
        period: newBudgetPeriod,
      };
      
      const addedBudget = await api.addBudget(newBudget);
      setBudgets([...budgets, addedBudget]);
      
      // Reset form
      setNewBudgetCategory("");
      setNewBudgetAmount("");
      setOpen(false);
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  const handleGetBudgetSuggestions = async () => {
    try {
      setIsLoadingSuggestions(true);
      const suggestions = await api.getPredictiveBudgetSuggestions();
      setSuggestedBudgets(suggestions);
      toast.info("AI has generated budget suggestions based on your spending patterns", {
        duration: 4000,
      });
    } catch (error) {
      console.error("Error getting budget suggestions:", error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const applyBudgetSuggestion = async (suggestion: Budget) => {
    try {
      const existingBudgetIndex = budgets.findIndex(b => b.category === suggestion.category);
      
      if (existingBudgetIndex >= 0) {
        // Update existing budget
        await api.updateExpense({
          ...budgets[existingBudgetIndex],
          amount: suggestion.amount
        });
        
        // Update local state
        const updatedBudgets = [...budgets];
        updatedBudgets[existingBudgetIndex] = {
          ...updatedBudgets[existingBudgetIndex],
          amount: suggestion.amount
        };
        setBudgets(updatedBudgets);
      } else {
        // Add new budget
        const newBudget = await api.addBudget({
          category: suggestion.category,
          amount: suggestion.amount,
          period: suggestion.period
        });
        setBudgets([...budgets, newBudget]);
      }
      
      // Remove from suggestions
      setSuggestedBudgets(suggestedBudgets.filter(s => s.id !== suggestion.id));
      toast.success(`Budget for ${suggestion.category} applied successfully`);
    } catch (error) {
      console.error("Error applying budget suggestion:", error);
      toast.error("Failed to apply budget suggestion");
    }
  };

  if (isLoading || isFetchingBudgets) {
    return (
      <div className="expense-card animate-pulse">
        <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-5 w-1/3 bg-gray-200 rounded"></div>
              <div className="h-5 w-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="expense-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Budget Planner</h3>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGetBudgetSuggestions}
                  disabled={isLoadingSuggestions}
                >
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  AI Suggestions
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Get AI-powered budget suggestions based on your spending patterns</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-expense-primary hover:bg-expense-primary/90">
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Budget</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="budget-category">Category</Label>
                  <Select
                    value={newBudgetCategory}
                    onValueChange={setNewBudgetCategory}
                  >
                    <SelectTrigger id="budget-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            ></div>
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget-amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="budget-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      className="pl-7"
                      value={newBudgetAmount}
                      onChange={(e) => setNewBudgetAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget-period">Period</Label>
                  <Select
                    value={newBudgetPeriod}
                    onValueChange={(value) => setNewBudgetPeriod(value as any)}
                  >
                    <SelectTrigger id="budget-period">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleAddBudget}
                  className="bg-expense-primary hover:bg-expense-primary/90"
                  disabled={!newBudgetCategory || !newBudgetAmount}
                >
                  Add Budget
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Budget List */}
      {budgets.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          No budgets set. Add your first budget to start tracking.
        </div>
      ) : (
        <div className="space-y-3">
          {budgets.map((budget) => {
            const categoryInfo = categories.find(c => c.name === budget.category);
            return (
              <div key={budget.id} className="flex justify-between items-center p-3 border rounded-md">
                <div className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: categoryInfo?.color || "#6B7280" }}
                  ></div>
                  <span>{budget.category}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">${budget.amount}</span>
                  <span className="text-sm text-muted-foreground ml-1">/</span>
                  <span className="text-sm text-muted-foreground">{budget.period}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* AI Budget Suggestions */}
      {suggestedBudgets.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
            <SparklesIcon className="h-4 w-4 mr-1 text-expense-accent" />
            AI Budget Suggestions
          </h4>
          <div className="space-y-2">
            {suggestedBudgets.map((suggestion) => {
              const categoryInfo = categories.find(c => c.name === suggestion.category);
              return (
                <div key={suggestion.id} className="flex justify-between items-center p-3 border border-dashed rounded-md bg-accent/10">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: categoryInfo?.color || "#6B7280" }}
                    ></div>
                    <span>{suggestion.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <span className="font-medium">${suggestion.amount}</span>
                      <span className="text-sm text-muted-foreground ml-1">/</span>
                      <span className="text-sm text-muted-foreground">{suggestion.period}</span>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-full text-expense-primary hover:text-expense-primary/90 hover:bg-expense-primary/10"
                      onClick={() => applyBudgetSuggestion(suggestion)}
                    >
                      <CheckCircle2Icon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPlanner;
