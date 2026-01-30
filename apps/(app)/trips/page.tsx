"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, MapPin, Calendar, Wallet, ArrowRight } from "lucide-react";
import Link from "next/link";

const mockTrips = [
  {
    id: "1",
    name: "Goa Beach Trip",
    location: "Goa, India",
    startDate: "2025-02-15",
    endDate: "2025-02-20",
    totalBudget: 50000,
    spent: 32000,
  },
  {
    id: "2",
    name: "Mountain Trekking",
    location: "Himalayas",
    startDate: "2025-03-01",
    endDate: "2025-03-10",
    totalBudget: 30000,
    spent: 12000,
  },
];

export default function TripsPage() {
  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Trips</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Plan and track your trip expenses
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Trip
          </Button>
        </div>

        {/* Trips Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockTrips.map((trip) => {
            const remaining = trip.totalBudget - trip.spent;
            const percentSpent = (trip.spent / trip.totalBudget) * 100;

            return (
              <Link key={trip.id} href={`/trips/${trip.id}`}>
                <Card className="p-6 border border-border hover:shadow-lg transition-all cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        {trip.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {trip.location}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div className="space-y-3">
                    {/* Budget Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-muted-foreground">
                          Budget Usage
                        </p>
                        <p className="text-xs font-semibold text-foreground">
                          {Math.round(percentSpent)}%
                        </p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-accent-secondary to-accent h-2 rounded-full transition-all"
                          style={{ width: `${percentSpent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Amounts */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Budget
                        </p>
                        <p className="font-semibold text-foreground">
                          ₹{trip.totalBudget.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Remaining
                        </p>
                        <p className="font-semibold text-accent-secondary">
                          ₹{remaining.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {mockTrips.length === 0 && (
          <Card className="p-12 border border-border text-center">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No trips yet</h3>
            <p className="text-muted-foreground mb-4">
              Create a trip to track your travel expenses
            </p>
            <Button>Create Your First Trip</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
