# Backend Integration for Video Calls

## Overview

The frontend now uses an **iframe approach** for video calls instead of complex SDK integration. This is simpler and more reliable.

## How It Works

1. **Expert clicks "Join Meeting"** → Opens `/expert/videocall/[roomId]`
2. **Frontend calls your API** → `GET /api/expert/videocall/url?roomId=xxx&userName=Expert`
3. **Your backend returns** → Complete video call URL
4. **Frontend embeds** → Video call URL in iframe

## API Endpoint to Implement

### `GET /api/expert/videocall/url`

**Request Parameters:**
- `roomId` (required): The room ID for the video call
- `userName` (optional): Display name, defaults to 'Expert'

**Response Format:**
```json
{
  "videoCallUrl": "https://your-video-call-backend.com/room/roomId?user=Expert&role=expert",
  "roomId": "roomId",
  "userName": "Expert"
}
```

## What Your Backend Should Do

### 1. Authentication & Authorization
- Verify the expert is logged in
- Check if they have permission to join this specific room
- Validate the room exists and is active

### 2. Generate Video Call URL
Your backend should generate a complete video call URL that includes:
- Room ID
- User authentication (token, session, etc.)
- User role (expert)
- Any other required parameters

### 3. Example URL Formats

**If using 100ms:**
```
https://app.100ms.live/meeting/roomId?token=your_generated_token
```

**If using your own video call service:**
```
https://your-video-service.com/room/roomId?user=Expert&token=session_token&role=expert
```

**If using Zoom/Teams/Google Meet:**
```
https://zoom.us/j/meetingId?pwd=password
```

## Current Implementation

The frontend currently has a placeholder API that returns:
```json
{
  "videoCallUrl": "https://your-video-call-backend.com/room/test_room?user=Expert&role=expert",
  "message": "Backend should provide the actual video call URL"
}
```

## What You Need to Replace

1. **Update the API endpoint** in `/app/api/expert/videocall/url/route.ts`
2. **Replace the placeholder URL** with your actual video call service URL
3. **Add proper authentication** and authorization logic
4. **Handle room creation** if rooms don't exist yet

## Security Considerations

1. **Validate room access** - Only allow experts to join their assigned rooms
2. **Token expiration** - Set appropriate expiry times for video call URLs
3. **Rate limiting** - Prevent abuse of the URL generation endpoint
4. **HTTPS only** - Ensure all video call URLs use HTTPS

## Testing

1. Visit `http://localhost:3002/test-videocall` to test the flow
2. Click any test room to see the iframe approach in action
3. Currently shows a placeholder URL - replace with your actual service

## Benefits of Iframe Approach

✅ **Simpler** - No complex SDK integration  
✅ **More reliable** - Uses your existing video call service  
✅ **Better security** - Authentication handled by your backend  
✅ **Easier maintenance** - Less frontend code to manage  
✅ **Cross-platform** - Works with any video call service  

## Next Steps

1. **Implement the URL generation** in your backend
2. **Replace the placeholder API** with your actual service
3. **Test the complete flow** from booking to video call
4. **Add proper error handling** for failed video calls 