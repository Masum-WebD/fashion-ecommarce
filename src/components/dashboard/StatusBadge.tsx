'use client';

type StatusType =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "active"
  | "inactive"
  | "approved"
  | "rejected"
  | "paid"
  | "unpaid"
  | "partial"
  | "completed"
  | "in-stock"
  | "low-stock"
  | "out-of-stock"
  | "unverified";

const statusStyles: Record<StatusType, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-gray-50 text-gray-600 border-gray-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  unpaid: "bg-amber-50 text-amber-700 border-amber-200",
  partial: "bg-orange-50 text-orange-700 border-orange-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "in-stock": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "low-stock": "bg-amber-50 text-amber-700 border-amber-200",
  "out-of-stock": "bg-red-50 text-red-700 border-red-200",
  unverified: "bg-red-50 text-red-700 border-red-200",
};

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status] || "bg-gray-50 text-gray-600 border-gray-200"
        }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${status === "active" || status === "delivered" || status === "approved" || status === "paid" || status === "completed" || status === "in-stock"
            ? "bg-emerald-500"
            : status === "pending" || status === "processing" || status === "unpaid" || status === "low-stock" || status === "partial"
              ? "bg-amber-500"
              : status === "cancelled" || status === "rejected" || status === "out-of-stock" || status === "unverified"
                ? "bg-red-500"
                : "bg-gray-400"
          }`}
      />
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
export type { StatusType };
