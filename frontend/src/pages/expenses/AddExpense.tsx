import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCategoriesAPI } from "../../api/categories";
import { createExpenseAPI } from "../../api/expenses";
import { useCalculatorStore } from "../../store/calculatorStore";
import { useAddExpenseAmount } from "../../store/addExpenseAmountStore";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";

const STORAGE_KEY = "spendwise_last_payment_mode";

const AddExpense = () => {
  const { open: openCalculator } = useCalculatorStore();
  const navigate = useNavigate();

  const getLastPaymentMode = () => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "CASH";
    } catch {
      return "CASH";
    }
  };

  const [form, setForm] = useState({
    categoryId: "",
    subCategoryId: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    paymentMode: getLastPaymentMode(),
    upiProvider: "",
    amount: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerAmount = useAddExpenseAmount((s) => s.registerAmountSetter);
  
  useEffect(() => {
    registerAmount((value: number) => update("amount", String(value)));
  }, []);

  const update = (k: string, v: any) => {
    setForm({ ...form, [k]: v });
    setError(null);

    if (k === "paymentMode") {
      try {
        localStorage.setItem(STORAGE_KEY, v);
      } catch {}
    }
  };

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAPI,
  });

  const selectedCategory = categories?.find(
    (c: any) => c.id === form.categoryId
  );

  const amountNum = Number(form.amount);
  const isAmountValid = form.amount !== "" && amountNum > 0;
  const isFormValid = form.categoryId && form.description.trim() && isAmountValid;

  const submit = async () => {
    setError(null);
    
    if (!form.categoryId) {
      setError("Please select a category");
      return;
    }
    if (!form.description.trim()) {
      setError("Please enter a description");
      return;
    }
    if (!isAmountValid) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    setIsSubmitting(true);
    try {
      await createExpenseAPI({
        ...form,
        amount: amountNum,
      });

      navigate("/expenses");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add expense. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto p-4 border-emerald-200 dark:border-emerald-900/30">
      <CardHeader>
        <CardTitle className="text-emerald-600 dark:text-emerald-400">Add Expense</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* CATEGORY */}
        <div className="space-y-1">
          <label className="font-medium text-gray-700 dark:text-gray-300">Category *</label>
          <Select value={form.categoryId} onValueChange={(v) => update("categoryId", v)}>
            <SelectTrigger className={!form.categoryId && error?.includes("category") ? "border-red-500" : ""}>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat: any) => (
                <SelectItem value={cat.id} key={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* SUBCATEGORY */}
        {selectedCategory && (
          <div className="space-y-1">
            <label className="font-medium text-gray-700 dark:text-gray-300">Subcategory</label>
            <Select onValueChange={(v) => update("subCategoryId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subcategory" />
              </SelectTrigger>
              <SelectContent>
                {selectedCategory.subCategories.map((sub: any) => (
                  <SelectItem value={sub.id} key={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* DESCRIPTION */}
        <div className="space-y-1">
          <label className="font-medium text-gray-700 dark:text-gray-300">Description *</label>
          <Input
            placeholder="Eg: Chicken Biryani + Coke"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className={!form.description.trim() && error?.includes("description") ? "border-red-500" : ""}
          />
        </div>

        {/* DATE */}
        <div className="space-y-1">
          <label className="font-medium text-gray-700 dark:text-gray-300">Date</label>
          <Input
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </div>

        {/* PAYMENT MODE */}
        <div className="space-y-1">
          <label className="font-medium text-gray-700 dark:text-gray-300">Payment Mode</label>
          <Select
            value={form.paymentMode}
            onValueChange={(v) => update("paymentMode", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Payment Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CASH">💵 Cash</SelectItem>
              <SelectItem value="UPI">📱 UPI</SelectItem>
              <SelectItem value="CARD">💳 Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* UPI PROVIDERS */}
        {form.paymentMode === "UPI" && (
          <div className="space-y-1">
            <label className="font-medium text-gray-700 dark:text-gray-300">UPI Provider</label>
            <Select onValueChange={(v) => update("upiProvider", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GPAY">Google Pay</SelectItem>
                <SelectItem value="PAYTM">Paytm</SelectItem>
                <SelectItem value="PHONEPE">PhonePe</SelectItem>
                <SelectItem value="AMAZON_PAY">Amazon Pay</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* AMOUNT */}
        <div className="space-y-1">
          <label className="font-medium text-gray-700 dark:text-gray-300">Amount *</label>
          <div className="flex gap-3">
            <Input
              type="number"
              min="0.01"
              step="0.01"
              className={`flex-1 ${form.amount && !isAmountValid ? 'border-red-500' : ''}`}
              placeholder="Enter amount"
              value={form.amount}
              onChange={(e) => update("amount", e.target.value)}
            />
            <Button type="button" variant="outline" onClick={() => openCalculator()}>
              Calc
            </Button>
          </div>
          {form.amount && !isAmountValid && (
            <p className="text-sm text-red-500">Amount must be greater than 0</p>
          )}
        </div>

        {/* SUBMIT */}
        <Button 
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          onClick={submit}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Expense"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddExpense;
