
import React from 'react';
import { AdventureLevel } from './types';
import { Card } from '@/components/ui/card';
import { Globe, PanelRight, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdventureLevelSelectorProps {
  onLevelSelect: (level: AdventureLevel) => void;
  selectedLevel: AdventureLevel | null;
}

const levelInfo = {
  casual: {
    title: 'Casual Explorer',
    description: 'Popular tourist destinations',
    icon: <Globe size={24} className="text-blue-400" />,
  },
  adventurous: {
    title: 'Adventurous Spirit',
    description: 'Unique yet accessible locations',
    icon: <PanelRight size={24} className="text-amber-400" />,
  },
  extreme: {
    title: 'Extreme Wanderer',
    description: 'Remote exotic locations',
    icon: <Mountain size={24} className="text-rose-400" />,
  }
};

const AdventureLevelSelector: React.FC<AdventureLevelSelectorProps> = ({ 
  onLevelSelect, 
  selectedLevel 
}) => {
  return (
    <div className="px-6 py-2 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Choose Your Adventure</h2>
      
      <div className="space-y-4">
        {(Object.keys(levelInfo) as AdventureLevel[]).map((level) => (
          <Card 
            key={level}
            className={`overflow-hidden transition-all duration-300 ${
              selectedLevel === level
                ? 'ring-2 ring-white shadow-lg shadow-white/10'
                : 'bg-opacity-40 bg-black/60 border-white/5 hover:bg-black/80'
            }`}
          >
            <button 
              className="w-full text-left"
              onClick={() => onLevelSelect(level)}
            >
              <div 
                className={`p-4 ${
                  selectedLevel === level
                    ? 'bg-gradient-to-br from-black/80 to-black/40'
                    : 'bg-black/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-full bg-black/30">
                      {levelInfo[level].icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{levelInfo[level].title}</h3>
                      <p className="text-xs text-white/70">{levelInfo[level].description}</p>
                    </div>
                  </div>
                  
                  <div className={`h-2 w-2 rounded-full ${
                    selectedLevel === level ? 'bg-white animate-pulse' : 'bg-white/30'
                  }`} />
                </div>
                
                <Button 
                  variant={selectedLevel === level ? "default" : "outline"}
                  className={`w-full mt-2 ${
                    selectedLevel === level 
                      ? 'bg-white text-black hover:bg-white/90' 
                      : 'bg-transparent border-white/20 text-white/70 hover:bg-white/10'
                  }`}
                  size="sm"
                >
                  {selectedLevel === level ? 'Selected' : 'Choose'}
                </Button>
              </div>
            </button>
          </Card>
        ))}
      </div>
      
      <div className="pt-4 text-center text-white/50 text-xs">
        <p>Click on the compass icon anytime to change your adventure level</p>
      </div>
    </div>
  );
};

export default AdventureLevelSelector;
