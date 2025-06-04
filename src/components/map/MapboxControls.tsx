
import React from 'react';
import { Compass, ZoomOut, RotateCw, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapboxControlsProps {
  onResetRotation?: () => void;
  onZoomOut?: () => void;
}

const MapboxControls: React.FC<MapboxControlsProps> = ({ 
  onResetRotation,
  onZoomOut 
}) => {
  const controls = [
    { name: 'compass', icon: <Compass size={20} />, onClick: onResetRotation },
    { name: 'zoom-out', icon: <ZoomOut size={20} />, onClick: onZoomOut },
    { name: 'rotate', icon: <RotateCw size={20} /> }
  ];

  return (
    <div className="absolute top-16 right-4 flex flex-col gap-2 z-10">
      {controls.map((control) => (
        <Button 
          key={control.name} 
          variant="outline" 
          size="icon" 
          onClick={control.onClick}
          className="h-10 w-10 rounded-full bg-black/40 border border-white/20 backdrop-blur-md text-white hover:bg-black/60 hover:text-blue-300"
        >
          {control.icon}
          <span className="sr-only">{control.name}</span>
        </Button>
      ))}
    </div>
  );
};

export default MapboxControls;
