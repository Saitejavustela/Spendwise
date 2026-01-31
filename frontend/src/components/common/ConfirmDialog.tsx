import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertTriangle, Trash2, Info } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) => {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const iconMap = {
    danger: <Trash2 className="w-6 h-6 text-red-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
  };

  const buttonMap = {
    danger: "bg-emerald-600 hover:bg-emerald-700 text-white",
    warning: "bg-emerald-600 hover:bg-emerald-700 text-white",
    info: "bg-emerald-600 hover:bg-emerald-700 text-white",
  };

  const bgMap = {
    danger: "bg-red-100 dark:bg-red-900/20",
    warning: "bg-amber-100 dark:bg-amber-900/20",
    info: "bg-blue-100 dark:bg-blue-900/20",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${bgMap[variant]}`}>
              {iconMap[variant]}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            className={buttonMap[variant]}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "..." : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
