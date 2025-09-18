"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Edit3, Save, X, Calendar } from "lucide-react"
import { updateUserDetailsService } from "@/service/user/profileService"
import { IconGenderAgender } from "@tabler/icons-react"

interface ProfileDetailsProps {
  user: any
  onUpdate: () => void
}

export default function ProfileDetails({ user, onUpdate }: ProfileDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    dob: user?.dob || "",
    address: user?.address || "",
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const data = {
        full_name: formData.full_name,
        dob: formData.dob,
        address: formData.address,
      }

      const res = await updateUserDetailsService(data)
      if (res.status === 200) {
        onUpdate()
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || "",
      dob: user?.dob || "",
      address: user?.address || "",
    })
    setIsEditing(false)
  }

  return (
    <div className="bg-card rounded-2xl shadow-md border border-border p-5 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Profile Details</h2>
          <p className="text-muted-foreground text-sm">
            Manage your personal information
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 bg-primaryColor text-white px-4 py-2 rounded-lg hover:bg-primaryColor/90 transition-colors font-medium shadow-sm"
          >
            <Edit3 size={16} />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-primaryColor text-white px-4 py-2 rounded-lg hover:bg-primaryColor/90 disabled:opacity-50 transition-colors font-medium"
            >
              <Save size={16} />
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name (Editable) */}
        <div className="bg-muted/40 py-1 rounded-xl">
          <label className="block text-xs uppercase font-medium text-muted-foreground mb-1">
            Full Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
          ) : (
            <p className="text-lg font-semibold">{user?.full_name || "-"}</p>
          )}
        </div>

        {/* Email (View Only) */}
        <div className="bg-muted/40 py-1 rounded-xl">
          <label className="block text-xs uppercase font-medium text-muted-foreground mb-1">
            Email
          </label>
          <div className="flex items-center gap-2 text-lg">
            <Mail size={16} className="text-muted-foreground" />
            {user?.email || "-"}
          </div>
        </div>

        {/* Phone (View Only) */}
        <div className="bg-muted/40 py-1 rounded-xl">
          <label className="block text-xs uppercase font-medium text-muted-foreground mb-1">
            Phone
          </label>
          <div className="flex items-center gap-2 text-lg">
            <Phone size={16} className="text-muted-foreground" />
            {user?.phone_number || "-"}
          </div>
        </div>

        {/* Gender (View Only) */}
        <div className="bg-muted/40  py-1 rounded-xl">
          <label className="block text-xs uppercase font-medium text-muted-foreground mb-1">
            Gender
          </label>
          <div className="flex items-center gap-2 text-lg">
            <IconGenderAgender size={16} className="text-muted-foreground" />
            {user?.gender || "-"}
          </div>
        </div>

        {/* DOB (Editable) */}
        <div className="bg-muted/40 py-1 rounded-xl">
          <label className="block text-xs uppercase font-medium text-muted-foreground mb-1">
            Date of Birth
          </label>
          {isEditing ? (
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
          ) : (
            <div className="flex items-center gap-2 text-lg">
              <Calendar size={16} className="text-muted-foreground" />
              {user?.dob || "-"}
            </div>
          )}
        </div>

        {/* Address (Editable) */}
        <div className="bg-muted/40 rounded-xl md:col-span-2">
          <label className="block text-xs uppercase font-medium text-muted-foreground mb-1">
            Address
          </label>
          {isEditing ? (
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
          ) : (
            <div className="flex items-start gap-2 text-lg">
              <MapPin size={16} className="text-muted-foreground mt-1" />
              {user?.address || "-"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
