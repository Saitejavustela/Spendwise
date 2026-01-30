"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tag,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  Plus,
  Trash2,
  X,
} from "lucide-react";

const mockCategories = [
  {
    id: "1",
    name: "Food & Dining",
    icon: "🍔",
    subCategories: [
      { id: "1-1", name: "Restaurants" },
      { id: "1-2", name: "Groceries" },
    ],
  },
  {
    id: "2",
    name: "Transport",
    icon: "🚗",
    subCategories: [{ id: "2-1", name: "Fuel" }, { id: "2-2", name: "Taxi" }],
  },
];

export default function CategoriesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [addingSubTo, setAddingSubTo] = useState<string | null>(null);

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Categories</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage categories and subcategories
            </p>
          </div>
          <Button onClick={() => setIsOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockCategories.map((cat) => {
            const isExpanded = expandedCategory === cat.id;

            return (
              <Card
                key={cat.id}
                className={`overflow-hidden border border-border transition-all ${
                  isExpanded ? "sm:col-span-2 lg:col-span-3" : ""
                }`}
              >
                {/* Category Header */}
                <div
                  onClick={() =>
                    setExpandedCategory(
                      isExpanded ? null : cat.id
                    )
                  }
                  className="group p-5 flex items-center justify-between hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-white">
                      <span className="text-xl">{cat.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {cat.subCategories?.length || 0} subcategories
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </div>

                {/* Expanded Subcategories */}
                {isExpanded && (
                  <div className="border-t border-border p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">
                        Subcategories
                      </h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setAddingSubTo(
                            addingSubTo === cat.id ? null : cat.id
                          )
                        }
                        className="gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </Button>
                    </div>

                    {addingSubTo === cat.id && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Subcategory name"
                          value={subCategoryName}
                          onChange={(e) => setSubCategoryName(e.target.value)}
                          className="flex-1"
                        />
                        <Button size="sm">Add</Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setAddingSubTo(null);
                            setSubCategoryName("");
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {cat.subCategories?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {cat.subCategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="group/sub flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"
                          >
                            <span className="text-sm text-foreground">
                              {sub.name}
                            </span>
                            <button className="opacity-0 group-hover/sub:opacity-100 text-muted-foreground hover:text-destructive transition-opacity">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No subcategories yet.
                      </p>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Add Category Modal */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input
                  placeholder="e.g., Food, Transport, Entertainment"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button>Create Category</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
