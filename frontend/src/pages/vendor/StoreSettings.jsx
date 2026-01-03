import React, { useEffect, useState, useCallback } from "react";
import VendorLayout from "../../layouts/VendorLayout";
import API from "../../api/api";
import { useToast } from "../../components/Toast";

import {
  Upload,
  Camera,
  MapPin,
  Building2,
  FileText,
  Globe,
  Phone,
  Mail,
  User,
  Key,
} from "lucide-react";

// Get API base URL
const getApiBaseUrl = () => {
  const raw = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;
};

// --- Sub-components moved OUTSIDE to prevent re-mounting on every keystroke ---

const Section = ({ icon: Icon, title, subtitle, children }) => (
  <div className="bg-white/80 backdrop-blur-sm border border-pink-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between gap-3 mb-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-pink-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
    {children}
  </div>
);

const InputField = ({ label, icon: Icon, value, onChange, type = "text", placeholder }) => (
  <div className="space-y-1">
    <label className="text-xs font-semibold flex items-center gap-2 text-pink-700">
      <Icon className="w-4 h-4 text-pink-500" />
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-xl border border-pink-100 bg-pink-50/60 text-sm outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition"
    />
  </div>
);

// --- Main Component ---

export default function StoreSettings() {
  const [store, setStore] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({ logo: false, banner: false });
  const { toast } = useToast();

  // Local state for previews ensures immediate UI feedback even if API data structure differs slightly
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  const loadStoreData = useCallback(async () => {
    try {
      // Assuming API returns JSON
      const { data } = await API.get("/vendor/me");

      setStore({
        shopName: data.shopName || "",
        description: data.description || "",
        contactEmail: data.contactEmail || "",
        contactPhone: data.contactPhone || "",
        website: data.website || "",
        logo: data.logo || "",
        banner: data.banner || "",
        address: {
          street: data.address?.street || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          pincode: data.address?.pincode || "",
        },
        whatsappEnabled: data.whatsappEnabled || false,
        whatsappNumber: data.whatsappNumber || "",
        ultraInstance: data.ultraInstance || "",
        ultraToken: data.ultraToken || "",
      });

      setLogoPreview(data.logo || "");
      setBannerPreview(data.banner || "");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load store details");
    }
  }, [toast]);

  useEffect(() => {
    loadStoreData();
  }, [loadStoreData]);

  const handleImageUpload = async (e, key) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading((prev) => ({ ...prev, [key]: true }));

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "vendors");

      const token = localStorage.getItem("token");
      const apiBaseUrl = getApiBaseUrl();
      
      const response = await fetch(`${apiBaseUrl}/upload/single`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Update store state for submission
        setStore((prev) => ({ ...prev, [key]: data.url }));

        // Update local preview immediately
        if (key === "logo") setLogoPreview(data.url);
        if (key === "banner") setBannerPreview(data.url);

        toast.success(`${key === "logo" ? "Logo" : "Banner"} uploaded successfully!`);
      } else {
        toast.error(data.message || "Failed to upload image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image");
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await API.put("/vendor/me", store);
      toast.success("Store settings updated 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setStore((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setStore((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  if (!store) {
    return (
      <VendorLayout title="Store Settings">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-3 text-pink-400">
            <div className="h-10 w-10 border-2 border-pink-300 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Loading store settings...</p>
          </div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout title="Store Settings">
      <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-white -mx-6 -mt-4 px-6 pt-4 pb-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-pink-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-[11px] font-semibold text-pink-500 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                Vendor • Store Profile
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Store Settings
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Personalize your store branding, contact details and integrations.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={loadStoreData}
                type="button"
                className="px-4 py-2 rounded-xl border border-pink-200 bg-white text-pink-600 text-sm font-medium hover:bg-pink-50 transition"
              >
                Reset
              </button>
              <button
                onClick={saveSettings}
                type="button"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold shadow-lg shadow-pink-200 hover:from-pink-600 hover:to-rose-600 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>Save Changes</>
                )}
              </button>
            </div>
          </div>

          {/* Main Grid: Left form + Right preview */}
          <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] gap-8 items-start">
            {/* LEFT SIDE – FORM SECTIONS */}
            <div className="space-y-6">
              {/* Store Branding */}
              <Section
                icon={Building2}
                title="Store Branding"
                subtitle="Upload logo & banner to make your store feel premium."
              >
                <div className="grid md:grid-cols-[2fr_1fr] gap-6">
                  {/* Banner */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-pink-700">
                      Store Banner
                      {uploading.banner && (
                        <span className="ml-2 text-blue-600">Uploading...</span>
                      )}
                    </div>
                    <label className="relative block h-40 md:h-48 rounded-2xl border border-dashed border-pink-200 overflow-hidden bg-pink-50/70 cursor-pointer group">
                      {bannerPreview ? (
                        <img
                          src={bannerPreview}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                          alt="Store banner"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-pink-400 gap-2">
                          <Upload className="w-6 h-6" />
                          <span className="text-xs font-medium">
                            Click to upload banner
                          </span>
                          <span className="text-[11px] text-pink-300">
                            Recommended 1200 x 400px • JPG or PNG
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "banner")}
                        disabled={uploading.banner}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-[11px] text-white/80 pointer-events-none">
                        <span className="px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm">
                          Visible on your public store page
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Logo */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-pink-700">
                      Store Logo
                      {uploading.logo && (
                        <span className="ml-2 text-blue-600">Uploading...</span>
                      )}
                    </div>
                    <label className="relative block w-32 h-32 rounded-2xl border border-dashed border-pink-200 overflow-hidden bg-pink-50 cursor-pointer group mx-auto md:mx-0">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform"
                          alt="Store logo"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-pink-400 gap-2">
                          <Camera className="w-6 h-6" />
                          <span className="text-[11px] font-medium text-center px-2">
                            Upload logo
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "logo")}
                        disabled={uploading.logo}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </label>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Square image works best. Max 5MB.
                    </p>
                  </div>
                </div>
              </Section>

              {/* Store Details */}
              <Section
                icon={FileText}
                title="Store Details"
                subtitle="These details appear on your store page and invoices."
              >
                <div className="space-y-4">
                  <InputField
                    label="Store Name"
                    icon={Building2}
                    value={store.shopName}
                    placeholder="e.g. RoseBloom Luxury Gifts"
                    onChange={(e) => handleInputChange("shopName", e.target.value)}
                  />

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-pink-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-pink-500" />
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={store.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe your store, collections or what makes you unique..."
                      className="w-full px-3 py-2.5 rounded-xl border border-pink-100 bg-pink-50/60 text-sm outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition resize-none"
                    />
                    <p className="text-[11px] text-gray-400">
                      This helps customers understand your brand and offerings.
                    </p>
                  </div>
                </div>
              </Section>

              {/* Contact */}
              <Section
                icon={User}
                title="Contact Information"
                subtitle="Customers will use these details to reach you."
              >
                <div className="grid md:grid-cols-2 gap-5">
                  <InputField
                    label="Contact Email"
                    icon={Mail}
                    type="email"
                    value={store.contactEmail}
                    placeholder="support@yourstore.com"
                    onChange={(e) =>
                      handleInputChange("contactEmail", e.target.value)
                    }
                  />
                  <InputField
                    label="Contact Phone"
                    icon={Phone}
                    value={store.contactPhone}
                    placeholder="+91 98765 43210"
                    onChange={(e) =>
                      handleInputChange("contactPhone", e.target.value)
                    }
                  />
                  <InputField
                    label="Website (optional)"
                    icon={Globe}
                    value={store.website}
                    placeholder="https://yourstore.com"
                    onChange={(e) => handleInputChange("website", e.target.value)}
                  />
                </div>
              </Section>

              {/* Address */}
              <Section
                icon={MapPin}
                title="Store Address"
                subtitle="Used for shipping, invoices and location-based features."
              >
                <div className="space-y-3">
                  <InputField
                    label="Street Address"
                    icon={MapPin}
                    value={store.address.street}
                    placeholder="Flat / Building / Street"
                    onChange={(e) =>
                      handleAddressChange("street", e.target.value)
                    }
                  />

                  <div className="grid md:grid-cols-3 gap-4">
                    <InputField
                      label="City"
                      icon={MapPin}
                      value={store.address.city}
                      placeholder="City"
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                    />
                    <InputField
                      label="State"
                      icon={MapPin}
                      value={store.address.state}
                      placeholder="State"
                      onChange={(e) => handleAddressChange("state", e.target.value)}
                    />
                    <InputField
                      label="Pincode"
                      icon={MapPin}
                      value={store.address.pincode}
                      placeholder="Pincode"
                      onChange={(e) =>
                        handleAddressChange("pincode", e.target.value)
                      }
                    />
                  </div>
                </div>
              </Section>

              {/* WhatsApp & Ultra Config */}
              <Section
                icon={Phone}
                title="WhatsApp & Alerts"
                subtitle="Send automatic order and status alerts to WhatsApp."
              >
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-pink-700">
                    <input
                      type="checkbox"
                      checked={store.whatsappEnabled}
                      onChange={(e) =>
                        handleInputChange("whatsappEnabled", e.target.checked)
                      }
                      className="w-4 h-4 rounded border-pink-300 text-pink-500 focus:ring-pink-300"
                    />
                    Enable WhatsApp Alerts
                  </label>

                  <div className="grid md:grid-cols-2 gap-4">
                    <InputField
                      label="WhatsApp Number"
                      icon={Phone}
                      value={store.whatsappNumber}
                      placeholder="+91 98765 43210"
                      onChange={(e) =>
                        handleInputChange("whatsappNumber", e.target.value)
                      }
                    />
                    <InputField
                      label="Ultra Instance ID"
                      icon={Key}
                      value={store.ultraInstance}
                      placeholder="Instance ID"
                      onChange={(e) =>
                        handleInputChange("ultraInstance", e.target.value)
                      }
                    />
                    <InputField
                      label="Ultra API Token"
                      icon={Key}
                      value={store.ultraToken}
                      placeholder="Your Ultra API token"
                      onChange={(e) =>
                        handleInputChange("ultraToken", e.target.value)
                      }
                    />
                  </div>

                  <p className="text-[11px] text-gray-400">
                    We never show API tokens publicly. They are encrypted and used
                    only for sending alerts.
                  </p>
                </div>
              </Section>
            </div>

            {/* RIGHT SIDE – LIVE STORE PREVIEW */}
            <div className="space-y-6 lg:sticky lg:top-20">
              <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-purple-500 rounded-3xl p-1 shadow-xl">
                <div className="bg-white/95 rounded-[22px] p-4 space-y-4">
                  <div className="text-xs font-semibold text-pink-500 flex items-center justify-between">
                    <span>Store Preview</span>
                    <span className="px-2 py-0.5 rounded-full bg-pink-50 text-[10px] text-pink-500">
                      Public view
                    </span>
                  </div>

                  {/* Banner preview */}
                  <div className="rounded-2xl overflow-hidden border border-pink-100 bg-pink-50 h-32 relative">
                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        className="w-full h-full object-cover"
                        alt="Banner preview"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-pink-300 text-xs">
                        Banner will appear here
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center overflow-hidden border border-pink-100">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            className="w-full h-full object-cover"
                            alt="Logo preview"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-pink-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white drop-shadow">
                          {store.shopName || "Your Store Name"}
                        </div>
                        <div className="text-[11px] text-pink-50">
                          {store.address.city || "City"},{" "}
                          {store.address.state || "Location"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Short info */}
                  <div className="space-y-3 pt-1">
                    <p className="text-xs text-gray-600 line-clamp-3">
                      {store.description ||
                        "Your store description will appear here. Highlight what makes your brand special and why customers love you."}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Mail className="w-3 h-3 text-pink-400" />
                        <span className="truncate">
                          {store.contactEmail || "email@store.com"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Phone className="w-3 h-3 text-pink-400" />
                        <span>{store.contactPhone || "+91 98765 43210"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 col-span-2">
                        <Globe className="w-3 h-3 text-pink-400" />
                        <span className="truncate">
                          {store.website || "https://yourstore.com"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-pink-100 mt-1 flex items-center justify-between">
                    <div className="text-[11px] text-gray-400">
                      WhatsApp alerts:{" "}
                      <span
                        className={
                          store.whatsappEnabled
                            ? "text-emerald-500 font-semibold"
                            : "text-gray-500"
                        }
                      >
                        {store.whatsappEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-pink-50 text-[11px] font-semibold text-pink-500 hover:bg-pink-100 transition"
                    >
                      View Public Store
                    </button>
                  </div>
                </div>
              </div>

              {/* Small tip card */}
              <div className="bg-white/90 border border-pink-100 rounded-2xl p-4 text-xs text-gray-500 space-y-2">
                <div className="font-semibold text-gray-800">
                  Pro tip for higher conversions 💡
                </div>
                <p>
                  Use a high quality banner and logo in the same color palette.
                  Keep your description short, clear and focused on customer
                  benefits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}