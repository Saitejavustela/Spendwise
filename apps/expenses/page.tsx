"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  CASH: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

// Mock data
const mockExpenses = [
  {
    id: "1",
    date: "2025-01-28",
    description: "Lunch at Pizza Hut",
    category: { name: "Food" },
    amount: 450,
    paymentMode: "CARD",
    trip: null,
  },
  {
    id: "2",
    date: "2025-01-27",
    description: "Fuel",
    category: { name: "Transport" },
    amount: 1200,
    paymentMode: "UPI",
    trip: { id: "1", name: "Weekend Trip" },
  },
  {
    id: "3",
    date: "2025-01-26",
    description: "Movie tickets",
    category: { name: "Entertainment" },
    amount: 600,
    paymentMode: "CASH",
    trip: null,
  },
];

export default function ExpensesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const categories = useMemo(() => {
    const cats = new Set(mockExpenses.map((exp) => exp.category?.name));
    return Array.from(cats).filter(Boolean);
  }, []);

  const filteredData = useMemo(() => {
    let result = [...mockExpenses];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (exp) =>
          exp.description?.toLowerCase().includes(searchLower) ||
          exp.category?.name?.toLowerCase().includes(searchLower)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((exp) => exp.category?.name === categoryFilter);
    }

    if (paymentFilter !== "all") {
      result = result.filter((exp) => exp.paymentMode === paymentFilter);
    }

    result.sort((a, b) => {
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
  }, [search, categoryFilter, paymentFilter, sortField, sortOrder]);

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
      <ChevronUp className="w-4 h-4 text-accent" />
    ) : (
      <ChevronDown className="w-4 h-4 text-accent" />
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {filteredData.length} expenses found
            </p>
          </div>
          <Link href="/expenses/add">
            <Button className="gap-2 bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4" />
              Add Expense
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="p-4 border border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {(categories as string[]).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
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
        </Card>

        {/* Table */}
        <Card className="border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      <SortIcon field="date" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                    Trip
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                    Payment
                  </th>
                  <th
                    className="px-6 py-4 text-right text-xs font-semibold text-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Amount
                      <SortIcon field="amount" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      No expenses found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((exp, idx) => (
                    <tr key={exp.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {new Date(exp.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                          {exp.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">
                        {exp.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {exp.trip ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-secondary/10 text-accent-secondary">
                            <Plane className="w-3 h-3" />
                            {exp.trip.name}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            paymentModeColors[exp.paymentMode] ||
                            "bg-muted text-foreground"
                          }`}
                        >
                          {paymentModeIcons[exp.paymentMode] || null}
                          {exp.paymentMode}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-foreground">
                        ₹{Number(exp.amount).toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
                {filteredData.length} entries
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
                <span className="text-sm text-foreground px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
