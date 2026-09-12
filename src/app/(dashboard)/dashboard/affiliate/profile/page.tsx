'use client';

import { useState, useRef } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Camera, Save, Mail, Phone, MapPin, Calendar, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { updateAccountProfile } from "@/lib/api/affiliate";
import { getImageUrl } from "@/lib/api/images";

const AffiliateProfile = () => {
  const { user, token, setAuth } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Initialize form with live user data
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      
      // If not editing, automatically trigger save for the profile pic
      if (!isEditing) {
        uploadProfilePicture(file);
      }
    }
  };

  const uploadProfilePicture = async (file: File) => {
    if (!token) return;
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("address", formData.address);
      fd.append("profile_pic", file);

      const res = await updateAccountProfile(token, fd);
      const updatedCustomer = res.data?.user || res.data?.customer || res.data;
      if (updatedCustomer && updatedCustomer.id) {
        setAuth(updatedCustomer, token);
      }
      toast.success("Profile picture updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update profile picture");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!token) return;
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("address", formData.address);
      if (selectedFile) {
        fd.append("profile_pic", selectedFile);
      }

      const res = await updateAccountProfile(token, fd);
      const updatedCustomer = res.data?.user || res.data?.customer || res.data;
      if (updatedCustomer && updatedCustomer.id) {
        setAuth(updatedCustomer, token);
      }
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Avatar path helper
  const currentAvatarUrl = previewUrl || getImageUrl(user?.avatar);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Your Account</h1>
          <p className="text-gray-500 mt-1">Manage your affiliate account information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
          <div className="relative inline-block mb-4 group cursor-pointer" onClick={triggerFileSelect}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {currentAvatarUrl ? (
              <img
                src={currentAvatarUrl}
                alt={formData.name}
                className="w-24 h-24 rounded-2xl object-cover mx-auto border-2 border-primary-100 group-hover:opacity-95 transition-opacity"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-md">
                {formData.name.charAt(0) || "A"}
              </div>
            )}
            <button className="absolute -bottom-1 -right-1 p-2 bg-primary-650 hover:bg-primary-750 text-white rounded-lg shadow-md transition-colors border-2 border-white">
              <Camera size={12} />
            </button>
          </div>
          <h3 className="text-lg font-bold text-gray-900">{formData.name || "Affiliate Partner"}</h3>
          <p className="text-sm text-primary-600 mt-1">Affiliate Code: <code className="bg-primary-50 px-1.5 py-0.5 rounded font-mono text-xs">{user?.affiliate?.affiliate_code || user?.username || "N/A"}</code></p>

          <div className="mt-6 space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail size={16} className="text-gray-400 shrink-0" />
              <span className="truncate">{formData.email || "No email provided"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone size={16} className="text-gray-400 shrink-0" />
              <span>{formData.phone || "No phone number"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin size={16} className="text-gray-400 shrink-0" />
              <span className="truncate">{formData.address || "No address provided"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar size={16} className="text-gray-400 shrink-0" />
              <span>Joined {user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "N/A"}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 pt-6 border-t border-gray-100">
            <div>
              <p className="text-lg font-bold text-gray-900">{user?.affiliate?.total_sales || 0}</p>
              <p className="text-xs text-gray-500">Total Sales</p>
            </div>
            <div>
              <p className="text-lg font-bold text-primary-600">৳{user?.affiliate?.total_earnings || 0}</p>
              <p className="text-xs text-gray-500">Earned</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-semibold text-primary-600 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || "",
                        email: user?.email || "",
                        phone: user?.phone || "",
                        address: user?.address || "",
                      });
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-xl transition-colors"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-750 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-primary-650/10 disabled:opacity-60"
                  >
                    {saving ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 disabled:opacity-60 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 disabled:opacity-60 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={true}
                  placeholder="Primary phone number (cannot be changed)"
                  className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm disabled:opacity-75 transition-all text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                  placeholder="Street name, City, Zipcode"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 disabled:opacity-60 transition-all"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateProfile;
