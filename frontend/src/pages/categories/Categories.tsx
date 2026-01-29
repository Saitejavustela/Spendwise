import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getCategoriesAPI, 
  createCategoryAPI, 
  deleteCategoryAPI,
  createSubCategoryAPI,
  deleteSubCategoryAPI 
} from "../../api/categories";
import { Link } from "react-router-dom";
import { Tag, ChevronRight, ChevronDown, FolderOpen, Plus, Trash2, X } from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

const Categories = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [addingSubTo, setAddingSubTo] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAPI,
  });

  const createMutation = useMutation({
    mutationFn: createCategoryAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsOpen(false);
      setCategoryName("");
    },
  });

  const handleCreate = () => {
    if (!categoryName.trim()) return;
    createMutation.mutate({ name: categoryName.trim() });
  };

  const deleteMutation = useMutation({
    mutationFn: deleteCategoryAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Delete this category? This will also delete all expenses and subcategories in it.")) {
      deleteMutation.mutate(id);
    }
  };

  const createSubMutation = useMutation({
    mutationFn: createSubCategoryAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setSubCategoryName("");
      setAddingSubTo(null);
    },
  });

  const deleteSubMutation = useMutation({
    mutationFn: deleteSubCategoryAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleAddSubCategory = (categoryId: string) => {
    if (!subCategoryName.trim()) return;
    createSubMutation.mutate({ categoryId, name: subCategoryName.trim() });
  };

  const handleDeleteSubCategory = (e: React.MouseEvent, subId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Delete this subcategory?")) {
      deleteSubMutation.mutate(subId);
    }
  };

  const toggleExpand = (e: React.MouseEvent, catId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCategory(expandedCategory === catId ? null : catId);
    setAddingSubTo(null);
    setSubCategoryName("");
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
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
        {(!data || data.length === 0) ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No categories found. Create one to get started!
            </p>
            <Button onClick={() => setIsOpen(true)} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>
        ) : (
          data.map((cat: any) => {
            const isExpanded = expandedCategory === cat.id;
            
            return (
              <div
                key={cat.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all ${
                  isExpanded ? "sm:col-span-2 lg:col-span-3" : ""
                }`}
              >
                {/* Category Header */}
                <Link
                  to={`/categories/${cat.id}`}
                  className="group p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                      {cat.icon ? (
                        <span className="text-xl">{cat.icon}</span>
                      ) : (
                        <Tag className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {cat.subCategories?.length || 0} subcategories
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleExpand(e, cat.id)}
                      className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                      title={isExpanded ? "Collapse" : "Manage subcategories"}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, cat.id)}
                      disabled={deleteMutation.isPending}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                  </div>
                </Link>

                {/* Expanded Subcategories Section */}
                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-700 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">Subcategories</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAddingSubTo(addingSubTo === cat.id ? null : cat.id)}
                        className="gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </Button>
                    </div>

                    {/* Add Subcategory Input */}
                    {addingSubTo === cat.id && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Subcategory name"
                          value={subCategoryName}
                          onChange={(e) => setSubCategoryName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddSubCategory(cat.id)}
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddSubCategory(cat.id)}
                          disabled={!subCategoryName.trim() || createSubMutation.isPending}
                        >
                          {createSubMutation.isPending ? "..." : "Add"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { setAddingSubTo(null); setSubCategoryName(""); }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {/* Subcategories List */}
                    {cat.subCategories?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {cat.subCategories.map((sub: any) => (
                          <div
                            key={sub.id}
                            className="group/sub flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">{sub.name}</span>
                            <button
                              onClick={(e) => handleDeleteSubCategory(e, sub.id)}
                              disabled={deleteSubMutation.isPending}
                              className="opacity-0 group-hover/sub:opacity-100 text-gray-400 hover:text-red-500 transition-opacity disabled:opacity-50"
                              title="Delete subcategory"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No subcategories yet.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
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
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!categoryName.trim() || createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
