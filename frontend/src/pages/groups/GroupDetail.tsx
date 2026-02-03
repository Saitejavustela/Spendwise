import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGroupSummaryAPI,
  addGroupExpenseAPI,
  addSettlementAPI,
  addGroupMemberAPI,
  deleteGroupMemberAPI,
  getGroupCategorySummaryAPI,
} from "../../api/groups";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useState } from "react";
import {
  Plus,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  Receipt,
  Check,
  ChevronDown,
  Trash2,
  Utensils,
  Plane,
  Home,
  Music,
  ShoppingBag,
  MoreHorizontal,
  History,
  CreditCard,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

type SplitType = "equal" | "unequal";

const CATEGORIES = [
  { name: "Food", icon: Utensils, color: "from-orange-500 to-red-500" },
  { name: "Travel", icon: Plane, color: "from-emerald-500 to-teal-500" },
  { name: "Stay", icon: Home, color: "from-cyan-500 to-blue-500" },
  { name: "Entertainment", icon: Music, color: "from-purple-500 to-pink-500" },
  { name: "Shopping", icon: ShoppingBag, color: "from-yellow-500 to-orange-500" },
  { name: "Other", icon: MoreHorizontal, color: "from-gray-500 to-gray-600" },
];

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [isMemberOpen, setIsMemberOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [settlementCategory, setSettlementCategory] = useState<string | null>(null);

  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Food");
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState<SplitType>("equal");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [unequalShares, setUnequalShares] = useState<Record<string, string>>({});

  const [fromMember, setFromMember] = useState("");
  const [toMember, setToMember] = useState("");
  const [settlementAmount, setSettlementAmount] = useState("");
  const [settlementNote, setSettlementNote] = useState("");

  const [memberName, setMemberName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["group", id],
    queryFn: () => getGroupSummaryAPI(id!),
  });

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ["groupCategory", id, expandedCategory],
    queryFn: () => getGroupCategorySummaryAPI(id!, expandedCategory!),
    enabled: !!expandedCategory,
  });

  const expenseMutation = useMutation({
    mutationFn: addGroupExpenseAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", id] });
      queryClient.invalidateQueries({ queryKey: ["groupCategory", id] });
      resetExpenseForm();
    },
  });

  const settlementMutation = useMutation({
    mutationFn: addSettlementAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", id] });
      queryClient.invalidateQueries({ queryKey: ["groupCategory", id] });
      setIsSettlementOpen(false);
      setFromMember("");
      setToMember("");
      setSettlementAmount("");
      setSettlementNote("");
      setSettlementCategory(null);
    },
  });

  const memberMutation = useMutation({
    mutationFn: addGroupMemberAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", id] });
      setIsMemberOpen(false);
      setMemberName("");
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: deleteGroupMemberAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", id] });
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "Cannot delete member with existing expenses");
    },
  });

  const resetExpenseForm = () => {
    setIsExpenseOpen(false);
    setExpenseDesc("");
    setExpenseAmount("");
    setExpenseCategory("Food");
    setPaidBy("");
    setSplitType("equal");
    setSelectedMembers([]);
    setUnequalShares({});
  };

  const handleAddExpense = () => {
    const amountNum = Number(expenseAmount);
    if (!expenseDesc || amountNum <= 0 || !paidBy) return;

    const members = data?.members || [];
    let shares: { memberId: string; amount: number }[] = [];

    if (splitType === "equal") {
      const splitMembers =
        selectedMembers.length > 0 ? selectedMembers : members.map((m: any) => m.id);
      const perPerson = Number(expenseAmount) / splitMembers.length;
      shares = splitMembers.map((memberId: string) => ({
        memberId,
        amount: perPerson,
      }));
    } else {
      shares = Object.entries(unequalShares)
        .filter(([_, amount]) => Number(amount) > 0)
        .map(([memberId, amount]) => ({
          memberId,
          amount: Number(amount),
        }));
    }

    expenseMutation.mutate({
      groupId: id,
      description: expenseDesc,
      amount: Number(expenseAmount),
      category: expenseCategory,
      paidBy,
      shares,
    });
  };

  const handleSettlement = () => {
    const amountNum = Number(settlementAmount);
    if (!fromMember || !toMember || amountNum <= 0) return;
    settlementMutation.mutate({
      groupId: id,
      fromMemberId: fromMember,
      toMemberId: toMember,
      amount: amountNum,
      note: settlementNote || (settlementCategory ? `Settlement for ${settlementCategory}` : undefined),
    });
  };

  const handleAddMember = () => {
    if (!memberName.trim()) return;
    memberMutation.mutate({
      groupId: id,
      displayName: memberName,
    });
  };

  const [deleteMemberConfirm, setDeleteMemberConfirm] = useState<{ open: boolean; memberId: string }>({ open: false, memberId: "" });

  const handleDeleteMemberClick = (memberId: string) => {
    setDeleteMemberConfirm({ open: true, memberId });
  };

  const handleConfirmDeleteMember = () => {
    deleteMemberMutation.mutate(deleteMemberConfirm.memberId);
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const openCategorySettlement = (category: string, fromId?: string) => {
    setSettlementCategory(category);
    if (fromId) setFromMember(fromId);
    setIsSettlementOpen(true);
  };

  const unequalTotal = Object.values(unequalShares).reduce((sum, val) => sum + (Number(val) || 0), 0);
  const expenseAmountNum = Number(expenseAmount) || 0;

  if (isLoading) return <LoadingSpinner />;

  const members = data?.members || [];
  const balances = data?.balances || [];
  const categoryBreakdown = data?.categoryBreakdown || [];
  const expenses = data?.expenses || [];
  const settlementsHistory = data?.settlementsHistory || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/groups")}
            className="p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {data?.group?.name || "Group"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {members.length} members
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsMemberOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
          <Button onClick={() => setIsExpenseOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Overall Balances */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Overall Balances</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {balances.map((m: any) => (
            <div
              key={m.memberId}
              className={`rounded-xl p-4 border ${
                m.balance > 0
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                  : m.balance < 0
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                    {m.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {m.name}
                    </p>
                    {m.balance > 0 ? (
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        Gets back ₹{m.balance.toLocaleString("en-IN")}
                      </p>
                    ) : m.balance < 0 ? (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Owes ₹{Math.abs(m.balance).toLocaleString("en-IN")}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">Settled up</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteMemberClick(m.memberId)}
                    disabled={deleteMemberMutation.isPending}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const catData = categoryBreakdown.find((c: any) => c.category === cat.name);
            const total = catData?.total || 0;
            const isExpanded = expandedCategory === cat.name;
            const Icon = cat.icon;

            return (
              <div
                key={cat.name}
                className={`rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all ${
                  isExpanded ? "sm:col-span-2 lg:col-span-3" : ""
                }`}
              >
                <div
                  onClick={() => setExpandedCategory(isExpanded ? null : cat.name)}
                  className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{cat.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ₹{total.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4 bg-gray-50 dark:bg-gray-900/30">
                    {categoryLoading ? (
                      <div className="text-center py-4 text-gray-500">Loading...</div>
                    ) : (
                      <>
                        {/* Category Balances */}
                        {categoryData?.balances?.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Balances in {cat.name}
                              </h3>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                              {categoryData.balances.map((b: any) => (
                                <div
                                  key={b.memberId}
                                  className={`p-3 rounded-lg flex items-center justify-between ${
                                    b.balance > 0
                                      ? "bg-emerald-50 dark:bg-emerald-900/20"
                                      : b.balance < 0
                                      ? "bg-red-50 dark:bg-red-900/20"
                                      : "bg-white dark:bg-gray-800"
                                  }`}
                                >
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                                      {b.name}
                                    </p>
                                    <p className={`text-sm ${
                                      b.balance > 0
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : b.balance < 0
                                        ? "text-red-600 dark:text-red-400"
                                        : "text-gray-500"
                                    }`}>
                                      {b.balance > 0
                                        ? `Gets ₹${b.balance.toLocaleString("en-IN")}`
                                        : b.balance < 0
                                        ? `Owes ₹${Math.abs(b.balance).toLocaleString("en-IN")}`
                                        : "Settled"}
                                    </p>
                                  </div>
                                  {b.balance < -0.01 && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openCategorySettlement(cat.name, b.memberId);
                                      }}
                                      className="text-xs"
                                    >
                                      Settle
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Suggested Settlements for this Category */}
                        {categoryData?.suggestedSettlements?.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Suggested Settlements
                            </h3>
                            <div className="space-y-2">
                              {categoryData.suggestedSettlements.map((s: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg text-sm"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{s.fromName}</span>
                                    <ArrowRight className="w-3 h-3 text-gray-400" />
                                    <span className="font-medium">{s.toName}</span>
                                  </div>
                                  <span className="font-bold text-emerald-600">₹{s.amount.toLocaleString("en-IN")}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Category Expenses */}
                        {categoryData?.expenses?.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Expenses
                            </h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {categoryData.expenses.map((e: any) => (
                                <div
                                  key={e.id}
                                  className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg text-sm"
                                >
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{e.description}</p>
                                    <p className="text-xs text-gray-500">Paid by {e.paidByName}</p>
                                  </div>
                                  <span className="font-bold text-gray-900 dark:text-white">₹{e.amount.toLocaleString("en-IN")}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Expenses & Settlements History */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
        <Tabs defaultValue="expenses">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="expenses" className="gap-2">
                <Receipt className="w-4 h-4" />
                Expenses
              </TabsTrigger>
              <TabsTrigger value="settlements" className="gap-2">
                <CreditCard className="w-4 h-4" />
                Settlements
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="expenses">
            {expenses.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No expenses yet</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {expenses.map((e: any) => {
                  const catInfo = CATEGORIES.find(c => c.name === e.category);
                  const CatIcon = catInfo?.icon || MoreHorizontal;
                  return (
                    <div
                      key={e.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${catInfo?.color || "from-gray-500 to-gray-600"} flex items-center justify-center text-white`}>
                          <CatIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{e.description}</p>
                          <p className="text-xs text-gray-500">
                            Paid by {e.paidByName} • {new Date(e.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">₹{e.amount.toLocaleString("en-IN")}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settlements">
            {settlementsHistory.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No settlements yet</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {settlementsHistory.map((s: any) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {s.fromName} → {s.toName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {s.note && `${s.note} • `}{new Date(s.settledAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600">₹{s.amount.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Expense Modal */}
      <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Group Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="What was the expense for?"
                value={expenseDesc}
                onChange={(e) => setExpenseDesc(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Paid By</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m: any) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Split Type Selection */}
            <div className="space-y-2">
              <Label>Split Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={splitType === "equal" ? "default" : "outline"}
                  onClick={() => setSplitType("equal")}
                  className={splitType === "equal" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  Equal Split
                </Button>
                <Button
                  type="button"
                  variant={splitType === "unequal" ? "default" : "outline"}
                  onClick={() => setSplitType("unequal")}
                  className={splitType === "unequal" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  Unequal Split
                </Button>
              </div>
            </div>

            {/* Equal Split - Member Selection */}
            {splitType === "equal" && (
              <div className="space-y-2">
                <Label>Split Among (leave empty for all)</Label>
                <div className="flex flex-wrap gap-2">
                  {members.map((m: any) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleMemberSelection(m.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedMembers.includes(m.id) || selectedMembers.length === 0
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-500"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-2 border-transparent"
                      }`}
                    >
                      {selectedMembers.includes(m.id) && <Check className="w-3 h-3 inline mr-1" />}
                      {m.displayName}
                    </button>
                  ))}
                </div>
                {expenseAmountNum > 0 && (
                  <p className="text-sm text-gray-500">
                    Each pays: ₹{(expenseAmountNum / (selectedMembers.length || members.length)).toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {/* Unequal Split - Custom Amounts */}
            {splitType === "unequal" && (
              <div className="space-y-2">
                <Label>Enter amounts for each member</Label>
                <div className="space-y-2">
                  {members.map((m: any) => (
                    <div key={m.id} className="flex items-center gap-3">
                      <span className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                        {m.displayName}
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={unequalShares[m.id] || ""}
                        onChange={(e) =>
                          setUnequalShares((prev) => ({ ...prev, [m.id]: e.target.value }))
                        }
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
                <div className={`text-sm ${Math.abs(unequalTotal - expenseAmountNum) < 0.01 ? "text-emerald-600" : "text-red-600"}`}>
                  Total: ₹{unequalTotal.toFixed(2)} / ₹{expenseAmountNum.toFixed(2)}
                  {Math.abs(unequalTotal - expenseAmountNum) >= 0.01 && " (must match)"}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={resetExpenseForm}>
                Cancel
              </Button>
              <Button
                onClick={handleAddExpense}
                disabled={
                  !expenseDesc || 
                  !expenseAmount || 
                  !paidBy || 
                  expenseMutation.isPending ||
                  (splitType === "unequal" && Math.abs(unequalTotal - expenseAmountNum) >= 0.01)
                }
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {expenseMutation.isPending ? "Adding..." : "Add Expense"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Member Modal */}
      <Dialog open={isMemberOpen} onOpenChange={setIsMemberOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Member Name</Label>
              <Input
                placeholder="Enter name"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsMemberOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddMember}
                disabled={!memberName.trim() || memberMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {memberMutation.isPending ? "Adding..." : "Add Member"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settlement Modal */}
      <Dialog open={isSettlementOpen} onOpenChange={setIsSettlementOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Record Settlement
              {settlementCategory && <span className="text-emerald-600"> ({settlementCategory})</span>}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>From (who is paying)</Label>
              <Select value={fromMember} onValueChange={setFromMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m: any) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>To (who is receiving)</Label>
              <Select value={toMember} onValueChange={setToMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m: any) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={settlementAmount}
                onChange={(e) => setSettlementAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Input
                placeholder="e.g., Cash payment, UPI"
                value={settlementNote}
                onChange={(e) => setSettlementNote(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsSettlementOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSettlement}
                disabled={!fromMember || !toMember || !settlementAmount || settlementMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {settlementMutation.isPending ? "Recording..." : "Record Settlement"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Member Dialog */}
      <ConfirmDialog
        open={deleteMemberConfirm.open}
        onOpenChange={(open) => setDeleteMemberConfirm({ ...deleteMemberConfirm, open })}
        title="Remove Member"
        description="Remove this member from the group? This is only possible if they have no expenses. Any existing expenses need to be deleted first."
        confirmText="Remove"
        variant="danger"
        onConfirm={handleConfirmDeleteMember}
        isLoading={deleteMemberMutation.isPending}
      />
    </div>
  );
};

export default GroupDetail;
