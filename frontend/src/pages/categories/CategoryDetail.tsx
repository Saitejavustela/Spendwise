import React from "react"

import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategoryDetailAPI } from "../../api/categories";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Calendar,
  CreditCard,
  Smartphone,
  Banknote,
  MoreHorizontal,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

type DateFilter = "week" | "month" | "year" | "all";

const COLORS = ["#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1"];

const paymentModeIcons: Record<string, React.ReactNode> = {
  CARD: <CreditCard className="w-4 h-4" />,
  UPI: <Smartphone className="w-4 h-4" />,
  CASH: <Banknote className="w-4 h-4" />,
  OTHER: <MoreHorizontal className="w-4 h-4" />,
};

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryDetailAPI(id!),
  });

  const filteredExpenses = useMemo(() => {
    if (!data?.expenses) return [];

    let result = [...data.expenses];

    const now = new Date();
    if (dateFilter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter((exp: any) => new Date(exp.date) >= weekAgo);
    } else if (dateFilter === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      result = result.filter((exp: any) => new Date(exp.date) >= monthAgo);
    } else if (dateFilter === "year") {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      result = result.filter((exp: any) => new Date(exp.date) >= yearAgo);
    }

    if (subCategoryFilter !== "all") {
      result = result.filter(
        (exp: any) => exp.subCategory?.name === subCategoryFilter
      );
    }

    return result;
  }, [data, dateFilter, subCategoryFilter]);

  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce(
      (sum: number, exp: any) => sum + Number(exp.amount),
      0
    );
  }, [filteredExpenses]);

  const subCategories = useMemo(() => {
    if (!data?.expenses) return [];
    const subs = new Set(
      data.expenses.map((exp: any) => exp.subCategory?.name).filter(Boolean)
    );
    return Array.from(subs);
  }, [data]);

  const chartData = useMemo(() => {
    if (!data?.breakdown) return [];
    return data.breakdown.map((item: any) => ({
      name: item.name || "Other",
      amount: Number(item.amount),
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-emerald-400">
            ₹{Number(payload[0].value).toLocaleString("en-IN")}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/categories")}
            className="p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {data?.category?.name || "Category"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {filteredExpenses.length} expenses
            </p>
          </div>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
          {(["week", "month", "year", "all"] as DateFilter[]).map((p) => (
            <button
              key={p}
              onClick={() => setDateFilter(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                dateFilter === p
                  ? "bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {p === "week" && "Week"}
              {p === "month" && "Month"}
              {p === "year" && "Year"}
              {p === "all" && "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-white/80 font-medium">Total Spent</p>
        </div>
        <p className="text-4xl font-bold">
          ₹{filteredTotal.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Subcategory Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Subcategory Breakdown
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[0, 8, 8, 0]} barSize={24}>
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Subcategory Filter */}
      {subCategories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSubCategoryFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              subCategoryFilter === "all"
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            All
          </button>
          {subCategories.map((sub) => (
            <button
              key={sub as string}
              onClick={() => setSubCategoryFilter(sub as string)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                subCategoryFilter === sub
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {sub as string}
            </button>
          ))}
        </div>
      )}

      {/* Expenses List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Expenses
        </h2>

        {filteredExpenses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            No expenses found
          </div>
        ) : (
          filteredExpenses.map((exp: any) => (
            <div
              key={exp.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {exp.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(exp.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {exp.subCategory?.name && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {exp.subCategory.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      {paymentModeIcons[exp.paymentMode]}
                      {exp.paymentMode}
                    </span>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{Number(exp.amount).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
