import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const userName = searchParams.get('userName');

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    // Return a mock video call interface for testing
    const mockVideoCallUrl = `/mock-videocall?roomId=${roomId}&userName=${userName}`;

    return NextResponse.json({
      success: true,
      videoCallUrl: mockVideoCallUrl,
      roomId,
      userName,
      message: 'Mock video call URL generated for testing'
    });

  } catch (error) {
    console.error('Error generating video call URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate video call URL' },
      { status: 500 }
    );
  }
} 