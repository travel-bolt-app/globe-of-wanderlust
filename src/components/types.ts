
export type AdventureLevel = 'casual' | 'adventurous' | 'extreme';

export interface Destination {
  name: string;
  country: string;
  coordinates: [number, number]; // [latitude, longitude]
  level: AdventureLevel;
}
