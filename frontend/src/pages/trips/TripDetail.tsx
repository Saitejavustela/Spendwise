import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTripSummaryAPI,
  addTripBudgetAPI,
  updateBudgetAPI,
  addTripExpenseAPI,
  getCategoryExpensesAPI,
} from "../../api/trips";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useState, useMemo } from "react";
import {
  Plus,
  Wallet,
  TrendingUp,
  AlertTriangle,
  Plane,
  Utensils,
  Home,
  ShoppingBag,
  Car,
  MoreHorizontal,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Smartphone,
  Banknote,
  PlusCircle,
  Coins,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const categoryIcons: Record<string, React.ReactNode> = {
  Travel: <Plane className="w-5 h-5" />,
  Food: <Utensils className="w-5 h-5" />,
  Stay: <Home className="w-5 h-5" />,
  Shopping: <ShoppingBag className="w-5 h-5" />,
  Transport: <Car className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  Travel: "from-blue-500 to-cyan-500",
  Food: "from-orange-500 to-amber-500",
  Stay: "from-purple-500 to-pink-500",
  Shopping: "from-emerald-500 to-teal-500",
  Transport: "from-indigo-500 to-violet-500",
};

const paymentIcons: Record<string, React.ReactNode> = {
  CASH: <Banknote className="w-4 h-4" />,
  CARD: <CreditCard className="w-4 h-4" />,
  UPI: <Smartphone className="w-4 h-4" />,
};

const EXPENSES_PAGE_SIZE = 10;
const STORAGE_KEY = "spendwise_last_payment_mode";

const getLastPaymentMode = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || "CASH";
  } catch {
    return "CASH";
  }
};

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [budgetCategory, setBudgetCategory] = useState("");
  const [allocatedBudget, setAllocatedBudget] = useState("");

  // Expandable category state
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expensePage, setExpensePage] = useState(1);

  // Expand budget modal state
  const [isExpandBudgetOpen, setIsExpandBudgetOpen] = useState(false);
  const [expandBudgetId, setExpandBudgetId] = useState("");
  const [expandBudgetCategory, setExpandBudgetCategory] = useState("");
  const [expandAmount, setExpandAmount] = useState("");

  // Add expense modal state
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [expensePaymentMode, setExpensePaymentMode] = useState(getLastPaymentMode());

  const { data, isLoading } = useQuery({
    queryKey: ["trip", id],
    queryFn: () => getTripSummaryAPI(id!),
  });

  // Fetch expenses for expanded category
  const { data: expensesData, isLoading: expensesLoading } = useQuery({
    queryKey: ["tripCategoryExpenses", id, expandedCategory, expensePage],
    queryFn: () => getCategoryExpensesAPI(id!, expandedCategory!, expensePage, EXPENSES_PAGE_SIZE),
    enabled: !!expandedCategory,
  });

  const budgetMutation = useMutation({
    mutationFn: addTripBudgetAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", id] });
      resetBudgetForm();
    },
  });

  const expandBudgetMutation = useMutation({
    mutationFn: ({ budgetId, amount }: { budgetId: string; amount: number }) =>
      updateBudgetAPI(budgetId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", id] });
      setIsExpandBudgetOpen(false);
      setExpandAmount("");
    },
  });

  const expenseMutation = useMutation({
    mutationFn: addTripExpenseAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", id] });
      queryClient.invalidateQueries({ queryKey: ["tripCategoryExpenses", id] });
      resetExpenseForm();
    },
  });

  const resetBudgetForm = () => {
    setIsBudgetOpen(false);
    setBudgetCategory("");
    setAllocatedBudget("");
  };

  const resetExpenseForm = () => {
    setIsExpenseOpen(false);
    setExpenseDesc("");
    setExpenseAmount("");
    setExpenseDate(new Date().toISOString().split("T")[0]);
    // Keep the payment mode - don't reset it so user's preference is preserved
  };

  const handleAddBudget = () => {
    if (!budgetCategory || !allocatedBudget) return;
    budgetMutation.mutate({
      tripId: id,
      category: budgetCategory,
      allocatedBudget: Number(allocatedBudget),
    });
  };

  const handleExpandBudget = () => {
    if (!expandAmount || !expandBudgetId) return;
    expandBudgetMutation.mutate({
      budgetId: expandBudgetId,
      amount: Number(expandAmount),
    });
  };

  const handleAddExpense = () => {
    if (!expenseDesc || !expenseAmount || !expensePaymentMode || !expenseCategory) return;
    expenseMutation.mutate({
      tripId: id,
      category: expenseCategory,
      description: expenseDesc,
      amount: Number(expenseAmount),
      date: expenseDate,
      paymentMode: expensePaymentMode,
    });
  };

  const openExpandBudgetModal = (budgetId: string, category: string) => {
    setExpandBudgetId(budgetId);
    setExpandBudgetCategory(category);
    setIsExpandBudgetOpen(true);
  };

  const openAddExpenseModal = (category: string) => {
    setExpenseCategory(category);
    setIsExpenseOpen(true);
  };

  const toggleCategory = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
      setExpensePage(1);
    }
  };

  // Calculate totals
  const totals = useMemo(() => {
    if (!data?.summary) return { allocated: 0, spent: 0, remaining: 0 };
    return data.summary.reduce(
      (acc: any, item: any) => ({
        allocated: acc.allocated + Number(item.allocated) + Number(item.additional),
        spent: acc.spent + Number(item.spent),
        remaining: acc.remaining + Number(item.remaining),
      }),
      { allocated: 0, spent: 0, remaining: 0 }
    );
  }, [data]);

  const overallProgress = totals.allocated > 0
    ? (totals.spent / totals.allocated) * 100
    : 0;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/trips")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {data?.trip?.name || "Trip"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Budget overview and tracking
            </p>
          </div>
        </div>
        <Button onClick={() => setIsBudgetOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Budget
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 opacity-80" />
            <p className="text-white/80 text-sm font-medium">Total Budget</p>
          </div>
          <p className="text-3xl font-bold">
            ₹{totals.allocated.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 opacity-80" />
            <p className="text-white/80 text-sm font-medium">Total Spent</p>
          </div>
          <p className="text-3xl font-bold">
            ₹{totals.spent.toLocaleString("en-IN")}
          </p>
        </div>

        <div className={`rounded-2xl p-5 text-white ${
          totals.remaining < 0
            ? "bg-gradient-to-br from-red-500 to-rose-600"
            : "bg-gradient-to-br from-amber-500 to-orange-600"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {totals.remaining < 0 ? (
              <AlertTriangle className="w-5 h-5 opacity-80" />
            ) : (
              <Wallet className="w-5 h-5 opacity-80" />
            )}
            <p className="text-white/80 text-sm font-medium">
              {totals.remaining < 0 ? "Over Budget" : "Remaining"}
            </p>
          </div>
          <p className="text-3xl font-bold">
            ₹{Math.abs(totals.remaining).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium text-gray-900 dark:text-white">
            Overall Progress
          </p>
          <span className={`text-sm font-semibold ${
            overallProgress > 100 ? "text-red-600" : "text-emerald-600"
          }`}>
            {overallProgress.toFixed(1)}%
          </span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              overallProgress > 100
                ? "bg-red-500"
                : overallProgress > 75
                ? "bg-amber-500"
                : "bg-emerald-500"
            }`}
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          />
        </div>
      </div>

      {/* Budget Categories */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Budget Categories
        </h2>

        {(!data?.summary || data.summary.length === 0) ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No budget categories yet. Add one to start tracking!
            </p>
            <Button onClick={() => setIsBudgetOpen(true)} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Budget Category
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {data.summary.map((b: any, idx: number) => {
              const totalBudget = Number(b.allocated) + Number(b.additional);
              const progress = totalBudget > 0 ? (Number(b.spent) / totalBudget) * 100 : 0;
              const gradientClass = categoryColors[b.category] || "from-gray-500 to-gray-600";
              const isExpanded = expandedCategory === b.category;

              return (
                <div
                  key={idx}
                  className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden ${
                    isExpanded ? "sm:col-span-2" : ""
                  }`}
                >
                  {/* Category Header - Clickable */}
                  <div
                    onClick={() => toggleCategory(b.category)}
                    className="p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradientClass} text-white`}>
                        {categoryIcons[b.category] || <MoreHorizontal className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {b.category}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ₹{Number(b.spent).toLocaleString("en-IN")} of ₹{totalBudget.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <span className={`text-sm font-semibold ${
                        progress > 100 ? "text-red-600" : progress > 75 ? "text-amber-600" : "text-emerald-600"
                      }`}>
                        {progress.toFixed(0)}%
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-4">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          progress > 100
                            ? "bg-red-500"
                            : progress > 75
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 dark:border-gray-700">
                      {/* Budget Breakdown */}
                      <div className="p-5 bg-gray-50 dark:bg-gray-700/30">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Budget</p>
                            <p className="font-bold text-emerald-600 dark:text-emerald-400">
                              ₹{totalBudget.toLocaleString("en-IN")}
                            </p>
                            {Number(b.additional) > 0 && (
                              <p className="text-xs text-amber-600 mt-0.5">
                                +₹{Number(b.additional).toLocaleString("en-IN")}
                              </p>
                            )}
                          </div>
                          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Spent</p>
                            <p className="font-bold text-violet-600 dark:text-violet-400">
                              ₹{Number(b.spent).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Remaining</p>
                            <p className={`font-bold ${Number(b.remaining) < 0 ? "text-red-600" : "text-amber-600"}`}>
                              ₹{Math.abs(Number(b.remaining)).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              openExpandBudgetModal(b.budgetId, b.category);
                            }}
                          >
                            <Coins className="w-4 h-4" />
                            Expand Budget
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAddExpenseModal(b.category);
                            }}
                          >
                            <PlusCircle className="w-4 h-4" />
                            Add Expense
                          </Button>
                        </div>
                      </div>

                      {/* Expenses List */}
                      <div className="p-5">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                          Expenses
                          {expensesData?.total > 0 && (
                            <span className="text-sm font-normal text-gray-500 ml-2">
                              ({expensesData.total} total)
                            </span>
                          )}
                        </h4>

                        {expensesLoading ? (
                          <div className="text-center py-4">
                            <LoadingSpinner />
                          </div>
                        ) : expensesData?.expenses?.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                            No expenses in this category yet. Add one above!
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {expensesData?.expenses?.map((exp: any) => (
                              <div
                                key={exp.id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg">
                                    {paymentIcons[exp.paymentMode] || <CreditCard className="w-4 h-4" />}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                                      {exp.description}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {new Date(exp.date).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                      })}
                                      {" • "}
                                      {exp.paymentMode}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">
                                  ₹{Number(exp.amount).toLocaleString("en-IN")}
                                </span>
                              </div>
                            ))}

                            {/* Pagination */}
                            {expensesData?.totalPages > 1 && (
                              <div className="flex items-center justify-center gap-2 pt-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpensePage((p) => Math.max(1, p - 1));
                                  }}
                                  disabled={expensePage === 1}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {expensePage} / {expensesData.totalPages}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpensePage((p) => Math.min(expensesData.totalPages, p + 1));
                                  }}
                                  disabled={expensePage === expensesData.totalPages}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Budget Modal */}
      <Dialog open={isBudgetOpen} onOpenChange={setIsBudgetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Budget Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Travel">✈️ Travel</SelectItem>
                  <SelectItem value="Food">🍽️ Food</SelectItem>
                  <SelectItem value="Stay">🏨 Stay</SelectItem>
                  <SelectItem value="Shopping">🛍️ Shopping</SelectItem>
                  <SelectItem value="Transport">🚗 Transport</SelectItem>
                  <SelectItem value="Activities">🎯 Activities</SelectItem>
                  <SelectItem value="Other">📦 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Budget Amount</Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={allocatedBudget}
                onChange={(e) => setAllocatedBudget(e.target.value)}
                className={allocatedBudget && Number(allocatedBudget) <= 0 ? 'border-red-500' : ''}
              />
              {allocatedBudget && Number(allocatedBudget) <= 0 && (
                <p className="text-xs text-red-500">Amount must be greater than 0</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={resetBudgetForm}>
                Cancel
              </Button>
              <Button
                onClick={handleAddBudget}
                disabled={!budgetCategory || !allocatedBudget || Number(allocatedBudget) <= 0 || budgetMutation.isPending}
              >
                {budgetMutation.isPending ? "Adding..." : "Add Budget"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Expand Budget Modal */}
      <Dialog open={isExpandBudgetOpen} onOpenChange={setIsExpandBudgetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Expand Budget - {expandBudgetCategory}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Additional Amount</Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Enter amount to add..."
                value={expandAmount}
                onChange={(e) => setExpandAmount(e.target.value)}
                className={expandAmount && Number(expandAmount) <= 0 ? 'border-red-500' : ''}
              />
              {expandAmount && Number(expandAmount) <= 0 ? (
                <p className="text-xs text-red-500">Amount must be greater than 0</p>
              ) : (
                <p className="text-xs text-gray-500">
                  This will be added to the existing budget for {expandBudgetCategory}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsExpandBudgetOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleExpandBudget}
                disabled={!expandAmount || expandBudgetMutation.isPending}
              >
                {expandBudgetMutation.isPending ? "Adding..." : "Add to Budget"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Expense Modal */}
      <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Add Expense - {expenseCategory}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="e.g., Taxi to airport"
                value={expenseDesc}
                onChange={(e) => setExpenseDesc(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className={expenseAmount && Number(expenseAmount) <= 0 ? 'border-red-500' : ''}
              />
              {expenseAmount && Number(expenseAmount) <= 0 && (
                <p className="text-xs text-red-500">Amount must be greater than 0</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Mode</Label>
              <Select 
                value={expensePaymentMode} 
                onValueChange={(v) => {
                  setExpensePaymentMode(v);
                  try { localStorage.setItem(STORAGE_KEY, v); } catch {}
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">💵 Cash</SelectItem>
                  <SelectItem value="CARD">💳 Card</SelectItem>
                  <SelectItem value="UPI">📱 UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={resetExpenseForm}>
                Cancel
              </Button>
              <Button
                onClick={handleAddExpense}
                disabled={!expenseDesc.trim() || !expenseAmount || Number(expenseAmount) <= 0 || !expensePaymentMode || expenseMutation.isPending}
              >
                {expenseMutation.isPending ? "Adding..." : "Add Expense"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TripDetail;
