import type { ProfileDetailsProps } from "@/types/user"
import { Mail, Phone, MapPin, Edit3 } from "lucide-react"

export default function ProfileDetails({ user }: ProfileDetailsProps) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-foreground">Profile Details</h2>
        <button className="inline-flex items-center gap-2 bg-primaryColor text-white text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium">
          <Edit3 size={16} />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
          <p className="text-foreground font-medium text-lg">{user.name}</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-muted-foreground" />
            <p className="text-foreground">{user.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-muted-foreground" />
            <p className="text-foreground">{user.phone}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-muted-foreground" />
            <p className="text-foreground">{user.location}</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Bio</label>
          <p className="text-foreground leading-relaxed bg-background/50 p-4 rounded-lg border border-border">
            {user.bio}
          </p>
        </div>
      </div>
    </div>
  )
}
