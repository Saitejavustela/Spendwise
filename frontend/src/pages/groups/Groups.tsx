import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGroupsAPI, createGroupAPI, deleteGroupAPI } from "../../api/groups";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Plus, Users, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const Groups = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: "",
    name: "",
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroupsAPI,
  });

  const createMutation = useMutation({
    mutationFn: createGroupAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setIsCreateOpen(false);
      setNewGroupName("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGroupAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    createMutation.mutate({ name: newGroupName });
  };

  const handleDeleteClick = (e: React.MouseEvent, group: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirm({ open: true, id: group.id, name: group.name });
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(deleteConfirm.id);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Groups
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Split expenses with friends and family
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4" />
          Create Group
        </Button>
      </div>

      {/* Groups List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(!data || data.length === 0) ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No groups yet. Create one to start splitting expenses!
            </p>
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4" />
              Create Group
            </Button>
          </div>
        ) : (
          data.map((group: any) => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                    {group.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {group.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {group.members?.length || 0} members
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDeleteClick(e, group)}
                    disabled={deleteMutation.isPending}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete group"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Create Group Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="e.g., Weekend Trip, Roommates"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim() || createMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {createMutation.isPending ? "Creating..." : "Create Group"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        title="Delete Group"
        description={`This will permanently delete "${deleteConfirm.name}" including all members, expenses, and settlements. This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Groups;
