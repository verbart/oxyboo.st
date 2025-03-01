"use client";

import React, { useEffect } from 'react';

interface DeepLinkScriptProps {
  exerciseId: string;
}

export const DeepLinkScript: React.FC<DeepLinkScriptProps> = ({ exerciseId }) => {
  useEffect(() => {
    const attemptDeepLink = () => {
      // Check if the app is already installed by using the deep link
      const deepLink = `oxyboost://exercise/${exerciseId}`;
      window.location.href = deepLink;
      
      // Fallback to the app store if the app is not installed
      // This timeout may not be reliable across all browsers/devices
      const timeout = setTimeout(() => {
        // For iOS
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
          window.location.href = 'https://apps.apple.com/app/oxyboost/id1638596237';
        } 
        // For Android
        else if (/Android/.test(navigator.userAgent)) {
          window.location.href = 'https://play.google.com/store/apps/details?id=com.oxybst.app';
        }
      }, 500);
      
      // Clear the timeout if the page is still open (user stayed in browser)
      window.addEventListener('blur', () => {
        clearTimeout(timeout);
      });
    };
    
    // Add a small delay to avoid immediate redirection when page loads
    const timer = setTimeout(() => {
      // We don't automatically attempt deep link anymore
      // Now initiated by user clicking the "Open in App" button
      // attemptDeepLink();
    }, 1500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [exerciseId]);
  
  return null;
}; 