"use client";

import React from 'react';
import { HMSRoomProvider } from '@100mslive/react-sdk';

interface VideoCallProviderProps {
  children: React.ReactNode;
}

const VideoCallProvider: React.FC<VideoCallProviderProps> = ({ children }) => {
  return (
    <HMSRoomProvider>
      {children}
    </HMSRoomProvider>
  );
};

export default VideoCallProvider; 