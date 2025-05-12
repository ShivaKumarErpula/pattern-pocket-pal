
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { api } from "@/lib/api";
import { Category, Expense, ReceiptData } from "@/types";
import ReceiptUploader from "./ReceiptUploader";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, "id">) => void;
  categories: Category[];
  isLoading: boolean;
  editExpense: Expense | null;
  onCancelEdit: () => void;
}

const ExpenseForm = ({ onAddExpense, categories, isLoading, editExpense, onCancelEdit }: ExpenseFormProps) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [receiptUrl, setReceiptUrl] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Set form values when editExpense changes
  useEffect(() => {
    if (editExpense) {
      setAmount(editExpense.amount.toString());
      setDate(new Date(editExpense.date));
      setCategory(editExpense.category);
      setDescription(editExpense.description);
      setReceiptUrl(editExpense.receiptUrl);
      setIsEditing(true);
    } else {
      resetForm();
      setIsEditing(false);
    }
  }, [editExpense]);

  const resetForm = () => {
    setAmount("");
    setDate(new Date());
    setCategory("");
    setDescription("");
    setReceiptUrl(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !category || !description) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const expenseData: Omit<Expense, "id"> = {
        amount: parseFloat(amount),
        date: date.toISOString().split("T")[0],
        category,
        description,
        receiptUrl,
      };

      if (isEditing && editExpense) {
        await api.updateExpense({
          ...expenseData,
          id: editExpense.id,
        });
      } else {
        await onAddExpense(expenseData);
      }
      
      resetForm();
      if (isEditing) {
        onCancelEdit();
      }
    } catch (error) {
      console.error("Error saving expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceiptProcessed = (receiptData: ReceiptData) => {
    setAmount(receiptData.amount.toString());
    setDate(new Date(receiptData.date));
    if (receiptData.category) {
      setCategory(receiptData.category);
    }
    setDescription(receiptData.vendor || "");
  };

  if (isLoading) {
    return (
      <div className="expense-card animate-pulse">
        <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-card">
      <h3 className="text-lg font-medium mb-4">
        {isEditing ? "Edit Expense" : "Add Expense"}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <ReceiptUploader onReceiptProcessed={handleReceiptProcessed} />
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-7"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={setCategory}
              required
            >
              <SelectTrigger id="category">
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            {isEditing && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              className="bg-expense-primary hover:bg-expense-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-pulse">Saving...</span>
                </>
              ) : (
                <>{isEditing ? "Update" : "Add"} Expense</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
