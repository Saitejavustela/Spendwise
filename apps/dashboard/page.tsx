"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  TrendingUp,
  Calendar,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CalendarRange,
  Search,
  X,
  Plus,
  Eye,
  Settings,
  LogOut,
} from "lucide-react";

export default function DashboardPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year" | "all">("month");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomRangeSearch = () => {
    if (fromDate && toDate) {
      setShowCustomRange(true);
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const clearCustomRange = () => {
    setShowCustomRange(false);
    setFromDate("");
    setToDate("");
  };

  const stats = [
    {
      title: "Total Spent",
      value: "₹24,563",
      icon: Wallet,
      gradient: "from-accent to-accent/80",
      trend: null,
    },
    {
      title: "This Month",
      value: "₹8,432",
      icon: Calendar,
      gradient: "from-accent-secondary to-accent-secondary/80",
      trend: 12,
    },
    {
      title: "This Week",
      value: "₹2,145",
      icon: TrendingUp,
      gradient: "from-accent-tertiary to-accent-tertiary/80",
      trend: -5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Track your spending habits and patterns
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6">
        <div className="space-y-6">
          {/* Period Filter Tabs */}
          <div className="flex gap-2 bg-muted p-1 rounded-lg w-fit">
            {(["week", "month", "year", "all"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  period === p
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "week" && "Week"}
                {p === "month" && "Month"}
                {p === "year" && "Year"}
                {p === "all" && "All Time"}
              </button>
            ))}
          </div>

          {/* Custom Date Range Filter */}
          <Card className="p-4 border border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 text-foreground">
                <CalendarRange className="w-5 h-5" />
                <span className="font-medium text-sm">Custom Range:</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">From</span>
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">To</span>
                  <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                <Button
                  onClick={handleCustomRangeSearch}
                  disabled={!fromDate || !toDate}
                  size="sm"
                  className="gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </Button>
                {showCustomRange && (
                  <Button
                    onClick={clearCustomRange}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Custom Range Result Card */}
          {showCustomRange && (
            <Card className="bg-gradient-to-r from-accent via-accent-secondary to-accent-tertiary p-6 border-0">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarRange className="w-5 h-5 text-white/80" />
                  <p className="text-white/80 text-sm font-medium">
                    {new Date(fromDate).toLocaleDateString()} to{" "}
                    {new Date(toDate).toLocaleDateString()}
                  </p>
                </div>
                {isLoading ? (
                  <p className="text-2xl font-bold text-white animate-pulse">
                    Loading...
                  </p>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-white mb-2">₹15,234</p>
                    <p className="text-white/70 text-sm">42 transactions</p>
                  </>
                )}
              </div>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {stats.map((stat) => (
              <Card
                key={stat.title}
                className={`bg-gradient-to-br ${stat.gradient} p-6 text-white border-0 shadow-lg hover:shadow-xl transition-shadow`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  {stat.trend !== null && (
                    <div className="flex items-center gap-1 text-sm">
                      {stat.trend >= 0 ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span>{Math.abs(stat.trend)}%</span>
                    </div>
                  )}
                </div>
                <p className="text-white/80 text-sm font-medium mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Add Expense
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Log a new expense quickly
                  </p>
                </div>
                <Plus className="w-6 h-6 text-accent" />
              </div>
              <Button className="w-full mt-4 bg-accent hover:bg-accent/90">
                Add Now
              </Button>
            </Card>

            <Card className="p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    View Insights
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Analyze your spending patterns
                  </p>
                </div>
                <Eye className="w-6 h-6 text-accent-secondary" />
              </div>
              <Button variant="outline" className="w-full mt-4">
                Explore
              </Button>
            </Card>
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Daily Spending Trend
              </h2>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                Chart will appear here
              </div>
            </Card>

            <Card className="p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Spending by Category
              </h2>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                Chart will appear here
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
