
import { Destination } from '../types';

// Sample destinations by adventure level
export const destinations: Destination[] = [
  // Casual destinations - common tourist spots
  { name: "Paris", country: "France", coordinates: [48.8566, 2.3522], level: 'casual' },
  { name: "Rome", country: "Italy", coordinates: [41.9028, 12.4964], level: 'casual' },
  { name: "London", country: "United Kingdom", coordinates: [51.5074, -0.1278], level: 'casual' },
  { name: "New York", country: "USA", coordinates: [40.7128, -74.0060], level: 'casual' },
  { name: "Tokyo", country: "Japan", coordinates: [35.6762, 139.6503], level: 'casual' },
  { name: "Barcelona", country: "Spain", coordinates: [41.3851, 2.1734], level: 'casual' },
  { name: "Sydney", country: "Australia", coordinates: [-33.8688, 151.2093], level: 'casual' },
  
  // Adventurous destinations - less common but still accessible
  { name: "Marrakech", country: "Morocco", coordinates: [31.6295, -7.9811], level: 'adventurous' },
  { name: "Chiang Mai", country: "Thailand", coordinates: [18.7883, 98.9853], level: 'adventurous' },
  { name: "Cusco", country: "Peru", coordinates: [-13.5320, -71.9675], level: 'adventurous' },
  { name: "Reykjavik", country: "Iceland", coordinates: [64.1466, -21.9426], level: 'adventurous' },
  { name: "Cape Town", country: "South Africa", coordinates: [-33.9249, 18.4241], level: 'adventurous' },
  { name: "Ljubljana", country: "Slovenia", coordinates: [46.0569, 14.5058], level: 'adventurous' },
  { name: "Tbilisi", country: "Georgia", coordinates: [41.7151, 44.8271], level: 'adventurous' },
  
  // Extreme destinations - remote, exotic locations
  { name: "Svalbard", country: "Norway", coordinates: [78.2232, 15.6267], level: 'extreme' },
  { name: "Easter Island", country: "Chile", coordinates: [-27.1127, -109.3497], level: 'extreme' },
  { name: "Socotra", country: "Yemen", coordinates: [12.5075, 53.9547], level: 'extreme' },
  { name: "Iqaluit", country: "Canada", coordinates: [63.7467, -68.5170], level: 'extreme' },
  { name: "Luang Namtha", country: "Laos", coordinates: [20.9500, 101.4070], level: 'extreme' },
  { name: "Kazbegi", country: "Georgia", coordinates: [42.6561, 44.6423], level: 'extreme' },
  { name: "Siwa Oasis", country: "Egypt", coordinates: [29.2033, 25.5195], level: 'extreme' }
];
