# Mock Video Call Interface Guide

## Overview
This guide explains how to test the mock video call interface that simulates a real video consultation experience.

## How to Test

### 1. From Booking Management
1. Go to the Expert Booking Management page
2. Look for bookings with meeting links (like "room_123")
3. Click "Join Meeting" in the Meeting Link column
4. The video call will open in a modal within the same page

### 2. From Direct URL
1. Navigate to: `http://localhost:3003/mock-videocall?roomId=test_room&userName=Expert`
2. This will show the full-screen video call interface

### 3. From Video Call Page
1. Navigate to: `http://localhost:3003/expert/videocall/room_123`
2. This will load the video call page which fetches the mock URL

## Features to Test

### Video Call Interface
- **Main Video Area**: Shows patient video (mock)
- **Expert Video**: Small picture-in-picture of expert
- **Connection Status**: Green dot showing "Connected"
- **Recording Indicator**: Red "REC" indicator
- **Participant Count**: Shows number of participants

### Control Buttons
- **Mute/Unmute**: Toggle microphone (red when muted)
- **Video On/Off**: Toggle camera (red when off)
- **Screen Share**: Toggle screen sharing (blue when active)
- **Chat**: Open/close chat panel (blue when open)
- **Participants**: Open/close participants list (blue when open)
- **Settings**: Open/close settings panel
- **End Call**: Red button to end the call

### Side Panels
- **Chat Panel**: 
  - Shows mock conversation
  - Can send new messages
  - Real-time message display
- **Participants Panel**:
  - Lists all participants
  - Shows speaking indicators
  - Shows video/mic status
- **Settings Panel**:
  - Audio device selection
  - Video device selection
  - Speaker selection

### Interactive Elements
- All buttons are clickable and show visual feedback
- Chat messages can be sent and received
- Panels can be opened/closed
- Status indicators animate (speaking, recording, etc.)

## Mock Data
- **Room ID**: Extracted from URL or booking data
- **Participants**: Dr. Sarah Johnson (Expert) and John Smith (Patient)
- **Chat Messages**: Pre-populated with sample conversation
- **Connection**: Always shows as "Connected"
- **Recording**: Always shows as "REC"

## Backend Integration
When ready to integrate with real backend:
1. Update `/api/expert/videocall/url/route.ts`
2. Replace the mock URL with actual video call provider URL
3. The iframe will load the real video call interface
4. All the same controls and panels will work with the real provider

## Testing Scenarios
1. **Basic Call**: Open video call and verify all elements display
2. **Chat Functionality**: Send messages and verify they appear
3. **Panel Toggles**: Open/close chat, participants, and settings panels
4. **Control Buttons**: Test mute, video, screen share buttons
5. **Responsive Design**: Test on different screen sizes
6. **Modal vs Full Screen**: Test both display modes

## Notes
- This is a mock interface for UI/UX testing
- No real video/audio streams
- All interactions are simulated
- Perfect for demonstrating the user experience to stakeholders
- Easy to replace with real video call provider integration 