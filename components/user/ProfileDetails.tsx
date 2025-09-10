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
    phone_number: user?.phone_number || "",
    gender: user?.gender || ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const data = {
        full_name: formData?.full_name,
        dob: formData?.dob,
        address: formData?.address,
      }

      console.log(data, 'update data')
      const res = await updateUserDetailsService(data)
      console.log(res)
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
      phone_number: user?.phone_number || "",
      gender: user?.gender || ""
    })
    setIsEditing(false)
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-foreground">Profile Details</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 bg-primaryColor text-white px-4 py-2 rounded-lg hover:bg-primaryColor/90 transition-colors font-medium"
          >
            <Edit3 size={16} />
            Edit Profile
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
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
          {isEditing ? (
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
          ) : (
            <p className="text-foreground font-medium text-lg">{user?.full_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-muted-foreground" />
            <p className="text-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
          {isEditing ? (
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
          ) : (
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-muted-foreground" />
              <p className="text-foreground">{user?.phone_number}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Gender</label>
          {isEditing ? (
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          ) : (
            <div className="flex items-center gap-2">
              <IconGenderAgender size={16} className="text-muted-foreground" />
              <p className="text-foreground">{user?.gender}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">DOB</label>
          {isEditing ? (
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
          ) : (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-muted-foreground" />
              <p className="text-foreground">{user?.dob}</p>
            </div>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Address</label>
          {isEditing ? (
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
          ) : (
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-muted-foreground mt-1" />
              <p className="text-foreground leading-relaxed">{user?.address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}