export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

// 100ms SDK for token generation
import { HMSSDK } from '@100mslive/server-sdk';

// Your 100ms configuration
const HMS_CONFIG = {
  appId: process.env.HMS_APP_ID || 'your_app_id_here',
  appSecret: process.env.HMS_APP_SECRET || 'your_app_secret_here',
  // You can get these from your 100ms dashboard
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const userId = searchParams.get('userId') || 'expert';
    const userName = searchParams.get('userName') || 'Expert';

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    // Validate 100ms credentials
    if (!HMS_CONFIG.appId || HMS_CONFIG.appId === 'your_app_id_here' || 
        !HMS_CONFIG.appSecret || HMS_CONFIG.appSecret === 'your_app_secret_here') {
      console.warn('100ms credentials not configured, using development fallback');
      return NextResponse.json({
        token: 'development_token_placeholder',
        userName: userName,
        roomId: roomId,
        userId: userId,
        message: 'Using development token - configure HMS_APP_ID and HMS_APP_SECRET for production'
      });
    }

    // In a real application, you would:
    // 1. Verify the user is authenticated
    // 2. Check if the user has permission to join this room
    // 3. Validate the room exists and is active
    // 4. Get user details from your database

    // Initialize the 100ms SDK
    const hmsSDK = new HMSSDK(HMS_CONFIG.appId, HMS_CONFIG.appSecret);

    // Generate authentication token
    const token = await hmsSDK.getAuthToken({
      roomId: roomId,
      userId: userId,
      role: 'host', // or 'guest' depending on your needs
      // Optional: Set token expiry (default is 24 hours)
      // expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    });

    return NextResponse.json({
      token: token,
      userName: userName,
      roomId: roomId,
      userId: userId,
    });

  } catch (error) {
    console.error('Error generating 100ms token:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication token' },
      { status: 500 }
    );
  }
} 