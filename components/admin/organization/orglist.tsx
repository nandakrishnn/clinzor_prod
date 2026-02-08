import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Edit3,
  Save,
  X,
  Building2,
  Users,
  CreditCard,
  Shield,
  Info,
  Plus,
  Trash2,
  Eye,
} from "lucide-react";
import {
  createOrganization,
  editOrganization,
  GetAllOrganization,
} from "@/service/admin/organizationManagementService";
import { toast } from "sonner";

// Define the organization type
interface Organization {
  uuid: string;
  created_by: string;
  privacy_policy: string;
  about_organization: string;
  free_expert_booking: number;
  expert_booking_charge: string;
  auto_approve_normal_slot: boolean;
  auto_approve_expert_slot: boolean;
}

// Define the form data type
interface OrganizationFormData {
  created_by: string;
  privacy_policy: string;
  about_organization: string;
  free_expert_booking: number | string;
  expert_booking_charge: string;
  auto_approve_normal_slot: boolean;
  auto_approve_expert_slot: boolean;
}

interface OrganizationPayload {
  created_by: string;
  privacy_policy: string;
  about_organization: string;
  free_expert_booking: number;
  expert_booking_charge: string;
  isPost: boolean;
  auto_approve_normal_slot: boolean;
  auto_approve_expert_slot: boolean;

  // Add other fields as needed
}

const OrganizationManagement = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [formData, setFormData] = useState<OrganizationFormData>({
    created_by: "",
    privacy_policy: "",
    about_organization: "",
    free_expert_booking: 0,
    expert_booking_charge: "0.00",
    auto_approve_normal_slot: false,
    auto_approve_expert_slot: false,
  });
  const [loading, setLoading] = useState(false);
  const [isPost, SetIsPost] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const fetchOrgData = async () => {
    try {
      setLoading(true);
      const data = await GetAllOrganization();

      setOrganizations(data);
      if (data.length > 0) {
        if (!data[0].uuid) {
          SetIsPost(true);
        }
        setFormData({ ...data[0] });
      }
      console.log(data, "org data");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgData();
  }, []);

  const handleEditToggle = () => {
    if (isEditMode && organizations.length > 0) {
      // Reset form data to original when canceling edit
      setFormData({ ...organizations[0] });
    }
    setIsEditMode(!isEditMode);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (organizations.length === 0) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const orgData: OrganizationPayload = {
        created_by: formData.created_by,
        privacy_policy: formData.privacy_policy,
        about_organization: formData.about_organization,
        free_expert_booking:
          typeof formData.free_expert_booking === "string"
            ? parseInt(formData.free_expert_booking)
            : formData.free_expert_booking,
        expert_booking_charge: formData.expert_booking_charge,
        isPost: isPost,
        auto_approve_normal_slot: formData.auto_approve_normal_slot,
        auto_approve_expert_slot: formData.auto_approve_expert_slot,
      };

      // Update existing organization
      const updatedOrg = await editOrganization({
        ...orgData,
      });

      setOrganizations([updatedOrg]);
      setIsEditMode(false);
      toast.success("Organization updated successfully!");
      setNotification({
        type: "success",
        message: "Organization updated successfully!",
      });
    } catch (error: any) {
      console.error("Error updating organization:", error);
      toast.error(
        error.response?.data?.message || "Failed to update organization"
      );
      setApiError(
        error.response?.data?.message || "Failed to update organization"
      );
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setApiError(null);
      }, 3000);
    }
  };

  const handleInputChange = (
    field: keyof OrganizationFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggleChange = (
    field: "auto_approve_normal_slot" | "auto_approve_expert_slot"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="bg-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primaryColor rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Organization Settings
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your organization configuration and policies
                </p>
              </div>
            </div>

            {organizations.length > 0 && (
              <button
                onClick={handleEditToggle}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm w-full sm:w-auto justify-center ${
                  isEditMode
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-primaryColor text-white "
                }`}
              >
                {isEditMode ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel Edit
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Settings
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 flex items-start justify-start ">
        {organizations.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No organization found
            </h3>
            <p className="text-gray-600">
              Organization configuration will be available here once created.
            </p>
          </div>
        ) : (
          <div className=" rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              {/* Notification */}
              {notification && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    notification.type === "success"
                      ? "bg-green-50 text-green-700"
                      : notification.type === "error"
                      ? "bg-red-50 text-red-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {notification.message}
                </div>
              )}

              {/* API Error */}
              {apiError && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                  {apiError}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* About Organization */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About Organization
                    </label>
                    <textarea
                      value={formData.about_organization}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        handleInputChange("about_organization", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm bg-gray-50"
                      rows={4}
                      disabled={!isEditMode}
                    />
                  </div>

                  {/* Privacy Policy */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Privacy Policy
                    </label>
                    <textarea
                      value={formData.privacy_policy}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        handleInputChange("privacy_policy", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm bg-gray-50"
                      rows={4}
                      disabled={!isEditMode}
                    />
                  </div>

                  {/* Free Expert Bookings */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Free Expert Bookings
                    </label>
                    <input
                      type="number"
                      value={formData.free_expert_booking}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("free_expert_booking", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                      min="0"
                      disabled={!isEditMode}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Expert Booking Charge */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expert Booking Charge (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.expert_booking_charge}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "expert_booking_charge",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                      step="0.01"
                      min="0"
                      disabled={!isEditMode}
                    />
                  </div>

                  {/* Toggle Settings */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      Auto-Approval Settings
                    </h3>

                    {/* Auto Approve Normal Slot */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Auto Approve Normal Slots
                        </label>
                        <p className="text-xs text-gray-500">
                          Automatically approve regular booking slots
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleChange("auto_approve_normal_slot")
                        }
                        disabled={!isEditMode}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.auto_approve_normal_slot
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        } ${
                          !isEditMode
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.auto_approve_normal_slot
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Auto Approve Expert Slot */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Auto Approve Expert Slots
                        </label>
                        <p className="text-xs text-gray-500">
                          Automatically approve expert booking slots
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleChange("auto_approve_expert_slot")
                        }
                        disabled={!isEditMode}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.auto_approve_expert_slot
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        } ${
                          !isEditMode
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.auto_approve_expert_slot
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              {isEditMode && (
                <div className="flex justify-end pt-8 mt-8 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-3 bg-primaryColor text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationManagement;
