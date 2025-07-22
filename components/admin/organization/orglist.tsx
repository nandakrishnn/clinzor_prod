import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Edit3, Save, X, Building2, Users, CreditCard, Shield, Info, Plus, Trash2, Eye } from 'lucide-react';

// Define the organization type
interface Organization {
  uuid: string;
  created_by: string;
  privacy_policy: string;
  about_organization: string;
  free_expert_booking: number;
  expert_booking_charge: string;
}

// Define the form data type
interface OrganizationFormData {
  created_by: string;
  privacy_policy: string;
  about_organization: string;
  free_expert_booking: number | string;
  expert_booking_charge: string;
}

const OrganizationManagement = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      uuid: "7cca9e3f-0f34-4eac-9a43-06e6e0271e04",
      created_by: "admin@gmail.com",
      privacy_policy: "We are committed to protecting your privacy and ensuring the security of your personal information. Our comprehensive privacy policy outlines how we collect, use, and safeguard your data.",
      about_organization: "We are a leading technology company focused on delivering innovative solutions that transform businesses and improve lives. Our mission is to bridge the gap between technology and human needs.",
      free_expert_booking: 3,
      expert_booking_charge: "500.00"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create'); // 'create', 'edit', 'view'
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<OrganizationFormData>({
    created_by: '',
    privacy_policy: '',
    about_organization: '',
    free_expert_booking: 0,
    expert_booking_charge: '0.00'
  });

  const resetForm = () => {
    setFormData({
      created_by: '',
      privacy_policy: '',
      about_organization: '',
      free_expert_booking: 0,
      expert_booking_charge: '0.00'
    });
  };

  const openCreateModal = () => {
    setModalMode('create');
    resetForm();
    setSelectedOrg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (org: Organization) => {
    setModalMode('edit');
    setFormData({ ...org });
    setSelectedOrg(org);
    setIsModalOpen(true);
  };

  const openViewModal = (org: Organization) => {
    setModalMode('view');
    setFormData({ ...org });
    setSelectedOrg(org);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrg(null);
    resetForm();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (modalMode === 'create') {
      const newOrg: Organization = {
        ...formData,
        uuid: crypto.randomUUID(),
        free_expert_booking: typeof formData.free_expert_booking === 'string' ? parseInt(formData.free_expert_booking) : formData.free_expert_booking,
        expert_booking_charge: formData.expert_booking_charge
      };
      setOrganizations(prev => [...prev, newOrg]);
    } else if (modalMode === 'edit' && selectedOrg) {
      setOrganizations(prev =>
        prev.map(org =>
          org.uuid === selectedOrg.uuid
            ? {
                ...formData,
                uuid: selectedOrg.uuid,
                free_expert_booking: typeof formData.free_expert_booking === 'string' ? parseInt(formData.free_expert_booking) : formData.free_expert_booking,
                expert_booking_charge: formData.expert_booking_charge
              }
            : org
        )
      );
    }

    closeModal();
  };

  const handleDelete = (uuid: string) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      setOrganizations(prev => prev.filter(org => org.uuid !== uuid));
    }
  };

  const handleInputChange = (field: keyof OrganizationFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'free_expert_booking' ? value : value
    }));
  };

  const getModalTitle = () => {
    switch(modalMode) {
      case 'create': return 'Create New Organization';
      case 'edit': return 'Edit Organization';
      case 'view': return 'Organization Details';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Organizations</h1>
                <p className="text-sm text-gray-600">Manage your organization settings and configurations</p>
              </div>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Organization
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Organizations</h3>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{organizations.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Free Bookings</h3>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {organizations.reduce((sum, org) => sum + org.free_expert_booking, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Avg. Booking Charge</h3>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  ${organizations.length > 0 ? (organizations.reduce((sum, org) => sum + parseFloat(org.expert_booking_charge), 0) / organizations.length).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Active Status</h3>
                <p className="text-2xl font-semibold text-green-600 mt-1">Active</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {organizations.map((org) => (
            <div key={org.uuid} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 font-mono">
                        {org.uuid.slice(0, 8)}...
                      </h3>
                      <p className="text-xs text-gray-500">Organization ID</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openViewModal(org)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(org)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(org.uuid)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase">Created By</span>
                    </div>
                    <p className="text-sm text-gray-900">{org.created_by}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Info className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase">About</span>
                    </div>
                    <p className="text-sm text-gray-900 line-clamp-2">{org.about_organization}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-medium text-gray-500">Free Bookings</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{org.free_expert_booking}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <CreditCard className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-medium text-gray-500">Charge</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">${org.expert_booking_charge}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {organizations.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first organization.</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Organization
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{getModalTitle()}</h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created By
                </label>
                <input
                  type="email"
                  value={formData.created_by}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('created_by', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="admin@example.com"
                  required
                  disabled={modalMode === 'view'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Organization
                </label>
                <textarea
                  value={formData.about_organization}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('about_organization', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows={4}
                  placeholder="Describe your organization..."
                  required
                  disabled={modalMode === 'view'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Privacy Policy
                </label>
                <textarea
                  value={formData.privacy_policy}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('privacy_policy', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows={4}
                  placeholder="Enter your privacy policy..."
                  required
                  disabled={modalMode === 'view'}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Free Expert Bookings
                  </label>
                  <input
                    type="number"
                    value={formData.free_expert_booking}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('free_expert_booking', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    min="0"
                    required
                    disabled={modalMode === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expert Booking Charge ($)
                  </label>
                  <input
                    type="number"
                    value={formData.expert_booking_charge}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('expert_booking_charge', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    step="0.01"
                    min="0"
                    required
                    disabled={modalMode === 'view'}
                  />
                </div>
              </div>

              {modalMode !== 'view' && (
                <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center w-full sm:w-auto justify-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {modalMode === 'create' ? 'Create Organization' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationManagement;