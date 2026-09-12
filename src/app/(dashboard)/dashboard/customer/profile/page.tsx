'use client';

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Camera, Save, Mail, Phone, MapPin, Calendar, User, ShoppingBag, Wallet } from "lucide-react";
import { toast } from "sonner";
import { fetchCustomerDashboard, updateCustomerProfile } from "@/lib/api/customer";
import { getImageUrl } from "@/lib/api/images";
import { useRouter } from "next/navigation";

export default function CustomerProfile() {
  const { user, token, isLoading, updateUser } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [stats, setStats] = useState<{ orders: number; spent: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
        setPageLoading(false);
        router.replace('/login');
        return;
    }
    // Fetch dashboard data just for the dynamic stats
    fetchCustomerDashboard(token)
      .then(res => {
        if (res.success && res.data?.stats) {
          setStats({
            orders: res.data.stats.total_orders || 0,
            spent: res.data.stats.total_spent || 0,
          });
        }
      })
      .catch(console.error)
      .finally(() => {
        setPageLoading(false);
      });
  }, [token, isLoading, router]);

  useEffect(() => {
    // Sync if user context changes
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setPreviewImage(user?.avatar_url || (user?.avatar ? getImageUrl(user.avatar) : null));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const data = new FormData();
      if (formData.name !== user?.name) data.append("name", formData.name);
      if (formData.email !== user?.email) data.append("email", formData.email);
      if (formData.address !== user?.address) data.append("address", formData.address);
      if (selectedImage) data.append("profile_pic", selectedImage);

      // Check if there are actually any changes
      const hasChanges = Array.from(data.keys()).length > 0;
      if (!hasChanges) {
        setIsEditing(false);
        setLoading(false);
        return;
      }

      const res = await updateCustomerProfile(data, token);

      if (res.success && res.data) {
        toast.success("Profile updated successfully!");
        // Update global auth state
        if (user) {
          const updatedUser = {
            ...user,
            name: res.data.name || user.name,
            email: res.data.email || user.email,
            address: res.data.address || user.address,
            avatar: res.data.profile_pic || user.avatar,
            avatar_url: res.data.profile_pic_url || user.avatar_url,
          };
          updateUser(updatedUser);
        }
        setIsEditing(false);
        setSelectedImage(null);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const formatBDT = (amount: number) =>
    "৳" + amount.toLocaleString("en-BD", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information</p>
      </div>

      {pageLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-2xl mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
            <div className="space-y-4 text-left">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 pt-6 border-t border-gray-100">
              <div className="bg-gray-100 rounded-xl h-16"></div>
              <div className="bg-gray-100 rounded-xl h-16"></div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="h-12 bg-gray-100 rounded-xl"></div>
                <div className="h-12 bg-gray-100 rounded-xl"></div>
                <div className="h-12 bg-gray-100 rounded-xl"></div>
                <div className="h-12 bg-gray-100 rounded-xl"></div>
                <div className="md:col-span-2 h-24 bg-gray-100 rounded-xl"></div>
              </div>
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
          <div className="relative inline-block mb-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            {previewImage ? (
              <img
                src={previewImage}
                alt={user?.name || "Profile"}
                className="w-24 h-24 rounded-2xl object-cover shadow-sm mx-auto border border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-sm">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-2 bg-white rounded-xl shadow-md border border-gray-200 hover:bg-gray-50 hover:text-primary transition-colors z-10"
              title="Change Photo"
            >
              <Camera size={16} className={selectedImage ? "text-primary" : "text-gray-600"} />
            </button>
          </div>
          <h3 className="text-lg font-bold text-gray-900">{user?.name}</h3>
          <p className="text-sm text-gray-500 mt-1 capitalize">{user?.role || "Customer"}</p>

          <div className="mt-6 space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail size={16} className="text-gray-400 shrink-0" />
              <span className="truncate">{user?.email || "No email"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone size={16} className="text-gray-400 shrink-0" />
              <span>{user?.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin size={16} className="text-gray-400 shrink-0" />
              <span className="truncate">{user?.address || "No address set"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar size={16} className="text-gray-400 shrink-0" />
              <span>Joined {user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : "Recently"}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 pt-6 border-t border-gray-100">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center justify-center gap-1.5 mb-1 text-primary">
                <ShoppingBag size={14} />
                <p className="text-xs font-semibold text-gray-500">Orders</p>
              </div>
              <p className="text-xl font-bold text-gray-900">{stats?.orders ?? "-"}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center justify-center gap-1.5 mb-1 text-emerald-600">
                <Wallet size={14} />
                <p className="text-xs font-semibold text-gray-500">Spent</p>
              </div>
              <p className="text-xl font-bold text-gray-900">{stats ? formatBDT(stats.spent) : "-"}</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className=" flex-col md:flex-row flex  gap-2 items-start justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-xl hover:bg-primary/5 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Save Changes
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-60 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-60 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="phone"
                  value={formData.phone}
                  disabled={true}
                  title="Phone number cannot be changed"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed transition-all"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-60 transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </>
  );
}
