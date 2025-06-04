
import { Destination, AdventureLevel } from '../../types';

// Function to select a random destination based on adventure level
export const selectRandomDestination = (
  destinations: Destination[],
  level: AdventureLevel
): Destination | null => {
  // Filter destinations by selected adventure level
  const filteredDestinations = destinations.filter(d => d.level === level);
  
  // No destination if no valid options
  if (filteredDestinations.length === 0) return null;
  
  // Select random destination
  const randomIndex = Math.floor(Math.random() * filteredDestinations.length);
  return filteredDestinations[randomIndex];
};
