'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Wallet, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { fetchPayoutDetails, updatePayoutDetails } from "@/lib/api/affiliate";

const PAYMENT_METHODS = [
  { value: "bkash", label: "bKash (Mobile Banking)" },
  { value: "nagad", label: "Nagad (Mobile Banking)" },
  { value: "rocket", label: "Rocket (Mobile Banking)" },
  { value: "bank", label: "Bank Transfer" },
  { value: "other", label: "Other" },
];

const AffiliatePayoutDetails = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [methodName, setMethodName] = useState("bkash");
  const [accountDetails, setAccountDetails] = useState("");

  useEffect(() => {
    if (!token) return;
    loadPayoutDetails();
  }, [token]);

  const loadPayoutDetails = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetchPayoutDetails(token);
      if (res.data) {
        setMethodName(res.data.method_name || "bkash");
        setAccountDetails(res.data.account_details || "");
      }
    } catch (err: any) {
      console.error(err);
      // No existing payout details is okay — user can create new ones
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!accountDetails.trim()) {
      toast.error("Please enter your account details.");
      return;
    }

    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("method_name", methodName);
      fd.append("account_details", accountDetails);

      const res = await updatePayoutDetails(token, fd);
      toast.success(res.message || "Payout details updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update payout details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payout Details</h1>
        <p className="text-gray-500 mt-1">Configure your payout method and account information</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-primary-50">
              <Wallet size={20} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Payment Method</h3>
              <p className="text-xs text-gray-500">Choose how you want to receive your commissions</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw size={20} className="animate-spin text-gray-400" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Method</label>
                <select
                  value={methodName}
                  onChange={(e) => setMethodName(e.target.value)}
                  disabled={saving}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all disabled:opacity-60"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Details</label>
                <textarea
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  placeholder={methodName === "bank" ? "Account holder name, bank name, account number, routing number" : "Enter your account number / wallet ID"}
                  disabled={saving}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all disabled:opacity-60 resize-y"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  {methodName === "bank"
                    ? "Provide full bank details: account holder name, bank name, account number, and routing number."
                    : "Enter the phone number or wallet ID associated with your account."}
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-750 transition-all flex items-center gap-2 shadow-md shadow-primary-650/15 disabled:opacity-60"
              >
                {saving ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Save Payout Details
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AffiliatePayoutDetails;
