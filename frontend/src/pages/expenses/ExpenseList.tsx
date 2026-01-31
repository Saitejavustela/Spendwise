import React from "react"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpensesAPI, deleteExpenseAPI } from "../../api/expenses";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  CreditCard,
  Smartphone,
  Banknote,
  Trash2,
  Plane,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";

type SortField = "date" | "amount";
type SortOrder = "asc" | "desc";

const paymentModeIcons: Record<string, React.ReactNode> = {
  CARD: <CreditCard className="w-4 h-4" />,
  UPI: <Smartphone className="w-4 h-4" />,
  CASH: <Banknote className="w-4 h-4" />,
};

const paymentModeColors: Record<string, string> = {
  CARD: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  UPI: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  CASH: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const ExpenseList = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: "" });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpensesAPI,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpenseAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(deleteConfirm.id);
  };

  const categories = useMemo(() => {
    if (!data?.items) return [];
    const cats = new Set(data.items.map((exp: any) => exp.category?.name));
    return Array.from(cats).filter(Boolean);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data?.items) return [];

    let result = [...data.items];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (exp: any) =>
          exp.description?.toLowerCase().includes(searchLower) ||
          exp.category?.name?.toLowerCase().includes(searchLower)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((exp: any) => exp.category?.name === categoryFilter);
    }

    if (paymentFilter !== "all") {
      result = result.filter((exp: any) => exp.paymentMode === paymentFilter);
    }

    result.sort((a: any, b: any) => {
      if (sortField === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const amountA = Number(a.amount);
        const amountB = Number(b.amount);
        return sortOrder === "asc" ? amountA - amountB : amountB - amountA;
      }
    });

    return result;
  }, [data, search, categoryFilter, paymentFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 text-emerald-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-emerald-600" />
    );
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            All Expenses
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {filteredData.length} expenses found
          </p>
        </div>
        <Link to="/expenses/add">
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>

        <Select
          value={categoryFilter}
          onValueChange={(v) => {
            setCategoryFilter(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-44">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat as string} value={cat as string}>
                {cat as string}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={paymentFilter}
          onValueChange={(v) => {
            setPaymentFilter(v);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="CASH">Cash</SelectItem>
            <SelectItem value="UPI">UPI</SelectItem>
            <SelectItem value="CARD">Card</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Cards View */}
      <div className="lg:hidden space-y-3">
        {paginatedData.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No expenses found</p>
          </div>
        ) : (
          paginatedData.map((exp: any) => (
            <div
              key={exp.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {exp.category?.name || "Uncategorized"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        paymentModeColors[exp.paymentMode] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {paymentModeIcons[exp.paymentMode] || null}
                      {exp.paymentMode}
                    </span>
                    {exp.trip && (
                      <Link to={`/trips/${exp.trip.id}`}>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
                          <Plane className="w-3 h-3" />
                          {exp.trip.name}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteClick(exp.id)}
                  disabled={deleteMutation.isPending}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(exp.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{Number(exp.amount).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-1">
                    Date
                    <SortIcon field="date" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Trip
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Payment
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Amount
                    <SortIcon field="amount" />
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    No expenses found
                  </td>
                </tr>
              ) : (
                paginatedData.map((exp: any, idx: number) => (
                  <tr
                    key={exp.id}
                    className={`hover:bg-emerald-50 dark:hover:bg-gray-700/50 transition-colors ${
                      idx % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-900/20"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(exp.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {exp.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                      {exp.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {exp.trip ? (
                        <Link to={`/trips/${exp.trip.id}`}>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-colors cursor-pointer">
                            <Plane className="w-3 h-3" />
                            {exp.trip.name}
                          </span>
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          paymentModeColors[exp.paymentMode] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {paymentModeIcons[exp.paymentMode] || null}
                        {exp.paymentMode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-gray-900 dark:text-white">
                      ₹{Number(exp.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDeleteClick(exp.id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
            {filteredData.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300 px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ExpenseList;
