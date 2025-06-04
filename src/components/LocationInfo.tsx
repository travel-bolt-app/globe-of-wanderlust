
import React from 'react';
import { Destination } from './types';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface LocationInfoProps {
  destination: Destination | null;
}

const LocationInfo: React.FC<LocationInfoProps> = ({ destination }) => {
  if (!destination) return null;

  return (
    <div className="location-info animate-pin-drop">
      <Card className="p-4 bg-black/70 text-white backdrop-blur-md border border-blue-600/30 shadow-lg shadow-blue-500/20 w-64">
        <div className="flex flex-col items-center gap-2">
          {/* Country image placeholder - in a real app, you'd use a real image */}
          <div className="w-full h-32 bg-gray-800 rounded-md overflow-hidden flex items-center justify-center">
            <MapPin size={40} className="text-blue-400" />
          </div>
          
          <div className="text-center pt-2">
            <div className="bg-blue-600/20 rounded-full px-3 py-1 mb-2 inline-block">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs uppercase font-medium tracking-wide text-blue-200">
                  {destination.level} Adventure
                </span>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-1">{destination.name}</h2>
            <p className="text-lg text-gray-300">{destination.country}</p>
          </div>
          
          <button className="mt-4 w-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors py-2 rounded-md text-sm font-medium">
            View More Info
          </button>
        </div>
      </Card>
    </div>
  );
};

export default LocationInfo;
