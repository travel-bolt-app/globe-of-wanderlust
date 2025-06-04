
import React from 'react';
import { Search, ZoomIn, ZoomOut, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleMapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onToggleTerrain?: () => void;
}

const GoogleMapControls: React.FC<GoogleMapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onToggleTerrain
}) => {
  const controls = [
    { name: 'search', icon: <Search size={20} />, action: () => console.log('Search clicked') },
    { name: 'zoom-in', icon: <ZoomIn size={20} />, action: onZoomIn },
    { name: 'zoom-out', icon: <ZoomOut size={20} />, action: onZoomOut },
    { name: 'toggle-terrain', icon: <Globe size={20} />, action: onToggleTerrain }
  ];

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
      {controls.map((control) => (
        <Button 
          key={control.name} 
          variant="outline" 
          size="icon" 
          onClick={control.action}
          className="h-10 w-10 rounded-full bg-black/40 border border-white/20 backdrop-blur-md text-white hover:bg-black/60 hover:text-blue-300"
        >
          {control.icon}
          <span className="sr-only">{control.name}</span>
        </Button>
      ))}
    </div>
  );
};

export default GoogleMapControls;
