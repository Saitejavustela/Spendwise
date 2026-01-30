"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const mockGroups = [
  {
    id: "1",
    name: "Roommates",
    members: 3,
    totalAmount: 45000,
    yourShare: 15000,
  },
  {
    id: "2",
    name: "Family Trip 2025",
    members: 5,
    totalAmount: 78000,
    yourShare: 20000,
  },
];

export default function GroupsPage() {
  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Groups</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage shared expenses with groups
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Group
          </Button>
        </div>

        {/* Groups Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockGroups.map((group) => (
            <Link key={group.id} href={`/groups/${group.id}`}>
              <Card className="p-6 border border-border hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">
                      {group.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <Users className="w-3 h-3 inline mr-1" />
                      {group.members} members
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Total Expenses
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{group.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      Your Share
                    </p>
                    <p className="text-lg font-semibold text-accent">
                      ₹{group.yourShare.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {mockGroups.length === 0 && (
          <Card className="p-12 border border-border text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">
              No groups yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Create a group to track shared expenses
            </p>
            <Button>Create Your First Group</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
