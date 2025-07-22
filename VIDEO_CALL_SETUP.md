# Video Call Setup Guide

This guide explains how to set up the 100ms video call integration for the expert booking system.

## Prerequisites

1. A 100ms account (sign up at https://100ms.live/)
2. Node.js and npm installed
3. Your Next.js project set up

## Setup Steps

### 1. Install Dependencies

The required dependencies are already included in `package.json`:
- `@100mslive/react-sdk` - For client-side video call functionality
- `@100mslive/server-sdk` - For server-side token generation

### 2. Configure Environment Variables

Create a `.env.local` file in your project root and add your 100ms credentials:

```env
# 100ms Configuration
# Get these values from your 100ms dashboard at https://dashboard.100ms.live/
HMS_APP_ID=your_100ms_app_id_here
HMS_APP_SECRET=your_100ms_app_secret_here

# Optional: 100ms Template ID (if you want to use a specific template)
HMS_TEMPLATE_ID=your_template_id_here
```

### 3. Get Your 100ms Credentials

1. Go to [100ms Dashboard](https://dashboard.100ms.live/)
2. Create a new app or use an existing one
3. Go to the "Developers" section
4. Copy your App ID and App Secret
5. Optionally, create a template for your video calls

### 4. How the Flow Works

#### Booking Management Flow:
1. Expert views their bookings in the booking management interface
2. For confirmed bookings with video calls, a "Join Meeting" link is displayed
3. When clicked, the link navigates to `/expert/videocall/[roomId]`

#### Video Call Flow:
1. The video call page loads and fetches an authentication token from `/api/expert/videocall/token`
2. The token is generated using your 100ms credentials
3. The video call interface joins the room using the token
4. Real-time video/audio communication begins

### 5. API Endpoints

#### GET `/api/expert/videocall/token`
- **Purpose**: Generate 100ms authentication tokens
- **Parameters**: 
  - `roomId` (required): The room ID for the video call
  - `userId` (optional): User ID, defaults to 'expert'
  - `userName` (optional): Display name, defaults to 'Expert'
- **Returns**: JSON with token and user information

### 6. Security Considerations

In production, you should:

1. **Authenticate users**: Verify the expert is logged in and authorized
2. **Validate room access**: Check if the expert has permission to join the specific room
3. **Rate limiting**: Implement rate limiting on the token generation endpoint
4. **Token expiration**: Set appropriate token expiration times
5. **HTTPS**: Ensure all communication is over HTTPS

### 7. Customization

#### Room Creation
You can customize how rooms are created by modifying the token generation logic in `/api/expert/videocall/token/route.ts`.

#### UI Customization
The video call interface can be customized by modifying `/components/expert/videocall/Videocall.tsx`.

#### Role Management
You can assign different roles (host, guest, etc.) based on your requirements.

### 8. Testing

1. Set up your environment variables
2. Start your development server: `npm run dev`
3. Navigate to a booking with a video call link
4. Click "Join Meeting" to test the video call

### 9. Troubleshooting

#### Common Issues:

1. **"Authentication token required" error**
   - Check your HMS_APP_ID and HMS_APP_SECRET environment variables
   - Ensure the API endpoint is accessible

2. **"Failed to join room" error**
   - Verify your 100ms credentials are correct
   - Check if the room ID is valid
   - Ensure you have proper permissions

3. **Video/Audio not working**
   - Check browser permissions for camera and microphone
   - Ensure you're using HTTPS in production
   - Check browser console for errors

### 10. Production Deployment

1. Set up proper environment variables in your production environment
2. Ensure HTTPS is enabled
3. Implement proper authentication and authorization
4. Set up monitoring and logging
5. Test thoroughly before going live

## Support

For 100ms-specific issues, refer to the [100ms Documentation](https://docs.100ms.live/).

For application-specific issues, check the console logs and network requests for debugging information. 