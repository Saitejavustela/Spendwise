"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Calculator } from "lucide-react";

export default function AddExpensePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    categoryId: "",
    subCategoryId: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    paymentMode: "CASH",
    upiProvider: "",
    amount: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.categoryId) {
      setError("Please select a category");
      return;
    }
    if (!form.description.trim()) {
      setError("Please enter a description");
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/expenses");
    } catch (err) {
      setError("Failed to add expense. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add Expense</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Log a new expense and track your spending
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-6 border border-border">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground font-medium">
                Category *
              </Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => handleChange("categoryId", v)}
              >
                <SelectTrigger
                  id="category"
                  className={
                    !form.categoryId && error?.includes("category")
                      ? "border-destructive"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">🍔 Food & Dining</SelectItem>
                  <SelectItem value="transport">🚗 Transport</SelectItem>
                  <SelectItem value="entertainment">🎬 Entertainment</SelectItem>
                  <SelectItem value="shopping">🛍️ Shopping</SelectItem>
                  <SelectItem value="utilities">💡 Utilities</SelectItem>
                  <SelectItem value="healthcare">🏥 Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-foreground font-medium"
              >
                Description *
              </Label>
              <Input
                id="description"
                placeholder="E.g., Lunch at Pizza Hut"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className={
                  !form.description.trim() && error?.includes("description")
                    ? "border-destructive"
                    : ""
                }
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-foreground font-medium">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>

            {/* Payment Mode */}
            <div className="space-y-2">
              <Label
                htmlFor="paymentMode"
                className="text-foreground font-medium"
              >
                Payment Mode
              </Label>
              <Select
                value={form.paymentMode}
                onValueChange={(v) => handleChange("paymentMode", v)}
              >
                <SelectTrigger id="paymentMode">
                  <SelectValue placeholder="Select Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">💵 Cash</SelectItem>
                  <SelectItem value="UPI">📱 UPI</SelectItem>
                  <SelectItem value="CARD">💳 Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* UPI Provider - shown conditionally */}
            {form.paymentMode === "UPI" && (
              <div className="space-y-2">
                <Label
                  htmlFor="upiProvider"
                  className="text-foreground font-medium"
                >
                  UPI Provider
                </Label>
                <Select
                  value={form.upiProvider}
                  onValueChange={(v) => handleChange("upiProvider", v)}
                >
                  <SelectTrigger id="upiProvider">
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

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground font-medium">
                Amount *
              </Label>
              <div className="flex gap-3">
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter amount"
                  value={form.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  className={
                    form.amount && Number(form.amount) <= 0
                      ? "border-destructive"
                      : ""
                  }
                />
                <Button type="button" variant="outline" className="gap-2">
                  <Calculator className="w-4 h-4" />
                  <span className="hidden sm:inline">Calc</span>
                </Button>
              </div>
              {form.amount && Number(form.amount) <= 0 && (
                <p className="text-sm text-destructive">
                  Amount must be greater than 0
                </p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-accent hover:bg-accent/90"
                disabled={!form.categoryId || !form.description || !form.amount || isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Expense"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
