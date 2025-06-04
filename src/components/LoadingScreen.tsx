
import React from 'react';

interface LoadingScreenProps {
  progress: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  return (
    <div className="loading-screen">
      <div className="mb-4">
        <div className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Loading Travel Destinations</h2>
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-gray-400 mt-2">{Math.round(progress)}%</p>
    </div>
  );
};

export default LoadingScreen;
