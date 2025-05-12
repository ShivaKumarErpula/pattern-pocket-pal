
import { Expense } from "@/types";
import { useState } from "react";
import { Button } from "./ui/button";
import { api } from "@/lib/api";
import { Edit2Icon, FilterIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ExpenseListProps {
  expenses: Expense[];
  categories: string[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
  onRefresh: () => void;
}

const ExpenseList = ({ 
  expenses, 
  categories, 
  isLoading,
  onDelete,
  onEdit,
  onRefresh
}: ExpenseListProps) => {
  const [filter, setFilter] = useState<string | null>(null);
  
  const handleDelete = async (id: string) => {
    try {
      await api.deleteExpense(id);
      onDelete(id);
      onRefresh();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const filteredExpenses = filter 
    ? expenses.filter(expense => expense.category === filter) 
    : expenses;

  if (isLoading) {
    return (
      <div className="expense-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Recent Expenses</h3>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="py-3 border-b border-gray-100 animate-pulse flex justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="expense-card">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h3 className="text-lg font-medium">Recent Expenses</h3>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <FilterIcon className="h-4 w-4" />
                {filter || "All Categories"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter(null)}>All Categories</DropdownMenuItem>
              {categories.map(category => (
                <DropdownMenuItem key={category} onClick={() => setFilter(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {filteredExpenses.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          No expenses found
        </div>
      ) : (
        <div>
          {filteredExpenses.map((expense) => (
            <div key={expense.id} className="py-3 border-b border-gray-100 last:border-b-0 flex justify-between items-center">
              <div>
                <div className="font-medium">{expense.description}</div>
                <div className="text-sm text-muted-foreground flex gap-2 items-center">
                  <span>{new Date(expense.date).toLocaleDateString()}</span>
                  <span className="inline-block h-1 w-1 rounded-full bg-gray-300"></span>
                  <span>{expense.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">${expense.amount.toFixed(2)}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(expense)}>
                      <Edit2Icon className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600" 
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this expense?")) {
                          handleDelete(expense.id);
                        }
                      }}
                    >
                      <Trash2Icon className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
