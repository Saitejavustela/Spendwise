import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTripsAPI, createTripAPI } from "../../api/trips";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Plus, MapPin, Calendar, ChevronRight } from "lucide-react";
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

const Trips = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: getTripsAPI,
  });

  const createMutation = useMutation({
    mutationFn: createTripAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      resetForm();
    },
  });

  const resetForm = () => {
    setIsCreateOpen(false);
    setTripName("");
    setStartDate("");
    setEndDate("");
  };

  const handleCreateTrip = () => {
    if (!tripName || !startDate || !endDate) return;
    createMutation.mutate({
      name: tripName,
      startDate,
      endDate,
    });
  };

  const getTripStatus = (start: string, end: string) => {
    const now = new Date();
    const startD = new Date(start);
    const endD = new Date(end);

    if (now < startD) return { label: "Upcoming", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    if (now > endD) return { label: "Completed", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" };
    return { label: "Active", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Trips
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Plan and track your travel budgets
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4" />
          Create Trip
        </Button>
      </div>

      {/* Trips List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(!data || data.length === 0) ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No trips planned yet. Create one to start budgeting!
            </p>
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4" />
              Create Trip
            </Button>
          </div>
        ) : (
          data.map((trip: any) => {
            const status = getTripStatus(trip.startDate, trip.endDate);
            return (
              <Link
                key={trip.id}
                to={`/trips/${trip.id}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-200"
              >
                {/* Decorative header */}
                <div className="h-20 bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 relative">
                  <div className="absolute inset-0 bg-black/10" />
                  <MapPin className="absolute bottom-3 right-3 w-6 h-6 text-white/50" />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${status.color}`}
                      >
                        {status.label}
                      </span>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {trip.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(trip.startDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        -{" "}
                        {new Date(trip.endDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Create Trip Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Create New Trip
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Trip Name</Label>
              <Input
                placeholder="e.g., Goa Beach Trip"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateTrip}
                disabled={!tripName || !startDate || !endDate || createMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {createMutation.isPending ? "Creating..." : "Create Trip"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Trips;
