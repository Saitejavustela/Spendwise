import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/axiosClient";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import DailyChart from "../../components/charts/DailyChart";
import CategoryChart from "../../components/charts/CategoryChart";
import { useState } from "react";
import { TrendingUp, Calendar, Wallet, ArrowUpRight, ArrowDownRight, CalendarRange, Search, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

type FilterPeriod = "week" | "month" | "year" | "all";

const Dashboard = () => {
  const [period, setPeriod] = useState<FilterPeriod>("month");
  
  // Custom date range state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showCustomRange, setShowCustomRange] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", period],
    queryFn: async () => {
      const res = await api.get(`/dashboard/overview?period=${period}`);
      return res.data;
    },
  });

  // Custom date range query
  const { data: customRangeData, isLoading: customRangeLoading, refetch: fetchCustomRange } = useQuery({
    queryKey: ["dashboardDateRange", fromDate, toDate],
    queryFn: async () => {
      const res = await api.get(`/dashboard/date-range?fromDate=${fromDate}&toDate=${toDate}`);
      return res.data;
    },
    enabled: false, // Only fetch when explicitly triggered
  });

  const handleCustomRangeSearch = () => {
    if (fromDate && toDate) {
      setShowCustomRange(true);
      fetchCustomRange();
    }
  };

  const clearCustomRange = () => {
    setShowCustomRange(false);
    setFromDate("");
    setToDate("");
  };

  if (isLoading) return <LoadingSpinner />;

  const stats = [
    {
      title: "Total Spent",
      value: data?.totalOverall ?? 0,
      icon: Wallet,
      gradient: "from-violet-500 to-purple-600",
      trend: null,
    },
    {
      title: "This Month",
      value: data?.totalThisMonth ?? 0,
      icon: Calendar,
      gradient: "from-emerald-500 to-teal-600",
      trend: data?.monthlyTrend ?? 0,
    },
    {
      title: "This Week",
      value: data?.totalThisWeek ?? 0,
      icon: TrendingUp,
      gradient: "from-amber-500 to-orange-600",
      trend: data?.weeklyTrend ?? 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Track your spending habits and patterns
          </p>
        </div>

        {/* Period Filter Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
          {(["week", "month", "year", "all"] as FilterPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                period === p
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {p === "week" && "Week"}
              {p === "month" && "Month"}
              {p === "year" && "Year"}
              {p === "all" && "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Range Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <CalendarRange className="w-5 h-5" />
            <span className="font-medium text-sm">Custom Range:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">From</span>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">To</span>
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
      </div>

      {/* Custom Range Result Card */}
      {showCustomRange && (
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-white/10 rounded-full" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <CalendarRange className="w-5 h-5 opacity-80" />
              <p className="text-white/80 text-sm font-medium">
                {new Date(fromDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                {" - "}
                {new Date(toDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            {customRangeLoading ? (
              <p className="text-2xl font-bold animate-pulse">Loading...</p>
            ) : (
              <>
                <p className="text-3xl font-bold mb-2">
                  ₹{Number(customRangeData?.totalSpent || 0).toLocaleString("en-IN")}
                </p>
                <p className="text-white/70 text-sm">
                  {customRangeData?.expenseCount || 0} transactions
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-90`} />
            
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                {stat.trend !== null && (
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.trend >= 0 ? "text-white/90" : "text-white/90"
                  }`}>
                    {stat.trend >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{Math.abs(stat.trend)}%</span>
                  </div>
                )}
              </div>
              
              <p className="text-white/80 text-sm font-medium mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-white">
                ₹{Number(stat.value).toLocaleString("en-IN")}
              </p>
            </div>

            {/* Decorative circle */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-white/10 rounded-full" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {showCustomRange ? "Custom Range Spending" : "Daily Spending Trend"}
          </h2>
          <DailyChart data={showCustomRange && customRangeData?.dailySeries ? customRangeData.dailySeries : (data?.dailySeries ?? [])} />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {showCustomRange ? "Categories in Range" : "Spending by Category"}
          </h2>
          <CategoryChart data={showCustomRange && customRangeData?.categorySeries ? customRangeData.categorySeries : (data?.categorySeries ?? [])} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

