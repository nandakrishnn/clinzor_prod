"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Suspense } from "react"

// Inner component that uses useSearchParams
const ExpertVideoCallContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const meetingUrl = searchParams.get("meetingUrl") || ""

  return (
    <div className="w-full h-[100vh] flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border bg-card">
        <button
          onClick={() => router.push("/user?tab=SUGGESTIONS")}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <h2 className="ml-2 font-semibold text-lg">Expert Video Call</h2>
      </div>

      {/* Video call */}
      <iframe
        src={meetingUrl}
        className="flex-1 w-full border-0"
        allow="camera; microphone; fullscreen; speaker; display-capture"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
      />
    </div>
  )
}

// Main component with Suspense
const ExpertVideoCall = () => {
  return (
    <Suspense fallback={
      <div className="w-full h-[100vh] flex items-center justify-center bg-background">
        <div className="text-lg">Loading video call...</div>
      </div>
    }>
      <ExpertVideoCallContent />
    </Suspense>
  )
}

export default ExpertVideoCall