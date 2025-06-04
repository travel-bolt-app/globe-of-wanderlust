# Travel Destination Explorer

This application helps users discover travel destinations around the world using Mapbox's interactive maps.

## Features

- Interactive 3D globe visualization
- Destination selection based on adventure levels
- Smooth animations and transitions
- Responsive design for all devices

## Setup

### Mapbox Access Token

This application uses Mapbox for map visualization. The Mapbox access token is already configured in the code, but if you need to use your own:

1. Go to [Mapbox](https://www.mapbox.com/) and create an account
2. Get your access token from the Account page
3. Replace the access token in `src/components/map/MapboxMap.tsx` with your own:

```typescript
mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";
```

### Running the app

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`

## Usage

1. Click the compass icon to open the adventure level selector
2. Choose an adventure level (casual, adventurous, or extreme)
3. The application will find a random destination that matches your adventure level
4. Explore the destination details and consider it for your next trip!

## Technologies Used

- React
- TypeScript
- Mapbox GL JS
- Tailwind CSS
- shadcn/ui components
