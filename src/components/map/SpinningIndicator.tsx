
import React from 'react';

interface SpinningIndicatorProps {
  isVisible: boolean;
}

const SpinningIndicator: React.FC<SpinningIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 bg-black/60 text-white px-6 py-2 rounded-full backdrop-blur-sm flex items-center gap-2 animate-pulse">
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
      <span>Finding destination...</span>
    </div>
  );
};

export default SpinningIndicator;
