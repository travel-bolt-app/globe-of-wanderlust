
import React from 'react';
import { Compass, ZoomOut, Menu, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GlobeControls: React.FC = () => {
  const controls = [
    { name: 'compass', icon: <Compass size={20} /> },
    { name: 'zoom-out', icon: <ZoomOut size={20} /> },
    { name: 'rotate', icon: <RotateCw size={20} /> },
    { name: 'menu', icon: <Menu size={20} /> }
  ];

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
      {controls.map((control) => (
        <Button 
          key={control.name} 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-full bg-black/40 border border-white/20 backdrop-blur-md text-white hover:bg-black/60 hover:text-blue-300"
        >
          {control.icon}
          <span className="sr-only">{control.name}</span>
        </Button>
      ))}
    </div>
  );
};

export default GlobeControls;
