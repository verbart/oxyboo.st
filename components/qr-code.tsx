'use client';

import React, { useEffect, useState } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
}

export function QRCode({ value, size = 180, bgColor = '#ffffff', fgColor = '#000000' }: QRCodeProps) {
  const [QRComponent, setQRComponent] = useState<React.ComponentType<any> | null>(null);
  
  useEffect(() => {
    // Dynamically import the QR code library on the client side
    import('react-qr-code').then(module => {
      setQRComponent(() => module.default);
    });
  }, []);
  
  if (!QRComponent) {
    return (
      <div 
        className="flex items-center justify-center bg-white" 
        style={{ width: size, height: size }}
      >
        <div className="animate-pulse bg-gray-200 rounded" style={{ width: size * 0.8, height: size * 0.8 }} />
      </div>
    );
  }
  
  return (
    <QRComponent
      value={value}
      size={size}
      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
      viewBox={`0 0 ${size} ${size}`}
      bgColor={bgColor}
      fgColor={fgColor}
    />
  );
} 